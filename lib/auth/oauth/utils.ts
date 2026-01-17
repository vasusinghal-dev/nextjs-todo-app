import { OAuthProvider } from "@/types";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

// Generate state parameter for CSRF protection
export async function generateState(provider: OAuthProvider): Promise<string> {
  const state = randomBytes(16).toString("base64url");

  const cookieStore = await cookies();
  cookieStore.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  return state;
}

// Generate PKCE code verifier and challenge
export async function generatePKCE(provider: OAuthProvider): Promise<string> {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const cookieStore = await cookies();
  cookieStore.set(`oauth_code_verifier_${provider}`, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  return codeChallenge;
}

// Verify OAuth state
export async function verifyOAuthState(
  state: string,
  provider: OAuthProvider,
): Promise<boolean> {
  const cookieStore = await cookies();
  const storedState = cookieStore.get(`oauth_state_${provider}`)?.value;

  if (!storedState || storedState !== state) {
    return false;
  }

  // Clean up after verification
  cookieStore.delete(`oauth_state_${provider}`);
  return true;
}

// Get stored code verifier
export async function getCodeVerifier(
  provider: OAuthProvider,
): Promise<string | null> {
  const cookieStore = await cookies();
  const verifier = cookieStore.get(`oauth_code_verifier_${provider}`)?.value;

  if (!verifier) {
    return null;
  }

  cookieStore.delete(`oauth_code_verifier_${provider}`);
  return verifier;
}
