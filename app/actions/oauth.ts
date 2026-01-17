"use server";

import { getConfig } from "@/lib/auth/oauth/config";
import { generatePKCE, generateState } from "@/lib/auth/oauth/utils";
import { getBaseUrl } from "@/lib/server/request";
import { OAuthProvider } from "@/types";
import { redirect } from "next/navigation";

export async function oAuthAction(provider: OAuthProvider) {
  const config = getConfig(provider);
  const state = await generateState(provider);
  const codeChallenge = await generatePKCE(provider);

  const BASE_URL = await getBaseUrl();

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: `${BASE_URL}/api/auth/callback/${provider}`,
    response_type: "code",
    scope: config.scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  redirect(`${config.authorizationEndpoint}?${params.toString()}`);
}
