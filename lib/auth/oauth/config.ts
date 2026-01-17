import { OAuthConfig } from "./types";

export const githubConfig: OAuthConfig = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  userInfoEndpoint: "https://api.github.com/user",
  scope: "user:email",
};

export const googleConfig: OAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userInfoEndpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
  scope: "openid email profile",
};

export function getConfig(provider: "github" | "google"): OAuthConfig {
  switch (provider) {
    case "github":
      return githubConfig;
    case "google":
      return googleConfig;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
