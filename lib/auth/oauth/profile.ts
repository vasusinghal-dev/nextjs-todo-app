import { githubProfileSchema, googleProfileSchema } from "./schema";
import { OAuthProfile } from "./types";
import { OAuthProvider } from "@/types";

function mapGithubProfile(raw: unknown): OAuthProfile {
  const data = githubProfileSchema.parse(raw);

  return {
    provider_user_id: String(data.id),
    email: data.email,
    name: data.name ?? data.login,
    avatar_url: data.avatar_url,
  };
}

function mapGoogleProfile(raw: unknown): OAuthProfile {
  const data = googleProfileSchema.parse(raw);

  return {
    provider_user_id: data.sub,
    email: data.email,
    name: data.name,
    avatar_url: data.picture,
  };
}

export function parseProfile(
  provider: OAuthProvider,
  raw: unknown,
): OAuthProfile {
  switch (provider) {
    case "github":
      return mapGithubProfile(raw);
    case "google":
      return mapGoogleProfile(raw);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
