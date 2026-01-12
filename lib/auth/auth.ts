import { randomBytes } from "crypto";
import { query } from "../db";
import { cookies } from "next/headers";

const generateSessionToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const createSession = async (userId: number) => {
  const sessionToken = generateSessionToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
    [sessionToken, userId, expires]
  );

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
};

export const verifySession = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const result = await query(
    "SELECT user_id FROM sessions WHERE id = $1 AND expires_at > now()",
    [sessionToken]
  );

  return result.rows[0]?.user_id || null;
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  try {
    if (sessionToken) {
      await query("DELETE FROM sessions WHERE id = $1", [sessionToken]);
    }
  } finally {
    cookieStore.delete({
      name: "session",
      path: "/",
    });
  }
};
