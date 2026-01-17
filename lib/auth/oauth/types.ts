import { OAuthProvider } from "@/types";

export type OAuthConfig = {
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  scope: string;
};

export type OAuthProfile = {
  provider_user_id: string;
  email?: string;
  name: string;
  avatar_url?: string;
};
