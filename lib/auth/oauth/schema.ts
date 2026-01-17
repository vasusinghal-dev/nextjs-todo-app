import { z } from "zod";

export const githubProfileSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string().optional(),
  email: z.email().toLowerCase().optional(),
  avatar_url: z.url().optional(),
});

export const googleProfileSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.email().toLowerCase().optional(),
  picture: z.url().optional(),
});

export const oauthTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string().optional(),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
});
