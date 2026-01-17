import { createSession } from "@/lib/auth/auth";
import { getConfig } from "@/lib/auth/oauth/config";
import { parseProfile } from "@/lib/auth/oauth/profile";
import { oauthTokenSchema } from "@/lib/auth/oauth/schema";
import { OAuthProfile } from "@/lib/auth/oauth/types";
import { getCodeVerifier, verifyOAuthState } from "@/lib/auth/oauth/utils";
import { prisma } from "@/lib/prisma";
import { OAuthProvider } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const oauthProviderSchema = z.enum(OAuthProvider);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerParam } = await params;
  const parsedProvider = oauthProviderSchema.safeParse(providerParam);

  if (!parsedProvider.success) {
    console.error("Invalid OAuth provider:", {
      provider: providerParam,
      error: parsedProvider.error.issues,
    });
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const provider = parsedProvider.data;
  const { searchParams } = new URL(req.url);

  const error = searchParams.get("error");
  if (error) {
    console.error("OAuth error", {
      provider,
      error,
      description: searchParams.get("error_description"),
    });

    return NextResponse.redirect(
      new URL("/login?error=oauth_cancelled", req.url),
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const validState = await verifyOAuthState(state, provider);
  if (!validState) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const config = getConfig(provider);
  const codeVerifier = await getCodeVerifier(provider);

  if (!codeVerifier) {
    console.error("Invalid OAuth state", { provider });
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const BASE_URL = req.nextUrl.origin;

  const tokenRes = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${BASE_URL}/api/auth/callback/${provider}`,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    console.error("Token endpoint failed", {
      provider,
      status: tokenRes.status,
    });

    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const tokenParsed = oauthTokenSchema.safeParse(await tokenRes.json());

  if (!tokenParsed.success) {
    console.error("Invalid OAuth token response", {
      provider,
      errors: tokenParsed.error.issues,
    });

    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const token = tokenParsed.data;

  const profileRes = await fetch(config.userInfoEndpoint, {
    headers: { Authorization: `${token.token_type} ${token.access_token}` },
  });

  if (!profileRes.ok) {
    console.error("Profile endpoint failed", {
      provider,
      status: profileRes.status,
    });

    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const profileRawData = await profileRes.json();

  let profileData: OAuthProfile;

  try {
    profileData = parseProfile(provider, profileRawData);
  } catch (err) {
    console.error("OAuth profile parsing failed", {
      provider,
      err,
    });

    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  try {
    const { access_token, refresh_token, expires_in, scope } = token;

    const expires_at =
      expires_in != null ? new Date(Date.now() + expires_in * 1000) : null;

    const { provider_user_id, email, name, avatar_url } = profileData;

    const oauthAccount = await prisma.oauth_account.findUnique({
      where: {
        provider_provider_user_id: {
          provider,
          provider_user_id,
        },
      },
      select: {
        user_id: true,
      },
    });

    let userId: number;

    if (oauthAccount) {
      userId = oauthAccount.user_id;
    } else {
      const existingUser = email
        ? await prisma.user.findUnique({ where: { email } })
        : null;

      if (existingUser) {
        await prisma.oauth_account.create({
          data: {
            provider,
            provider_user_id,
            user_id: existingUser.id,
            access_token,
            refresh_token,
            expires_at,
            scope,
          },
        });

        userId = existingUser.id;
      } else {
        const user = await prisma.user.create({
          data: {
            email,
            name,
            avatar_url,
            oauth_accounts: {
              create: {
                provider,
                provider_user_id,
                access_token,
                refresh_token,
                expires_at,
                scope,
              },
            },
          },
        });

        userId = user.id;
      }
    }

    await createSession(userId);
  } catch (err) {
    console.error(err);
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
