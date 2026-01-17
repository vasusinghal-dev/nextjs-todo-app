import { randomBytes } from "crypto";
// import { query } from "../db";
import { cookies } from "next/headers";
import { prisma } from "../prisma";

const generateSessionToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const createSession = async (userId: number) => {
  const sessionToken = generateSessionToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      id: sessionToken,
      user_id: userId,
      expires_at: expires,
    },
  });

  // await query(
  //   "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
  //   [sessionToken, userId, expires]
  // );

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
};

export const verifySession = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const user = await prisma.session.findFirst({
    where: {
      id: sessionToken,
      expires_at: {
        gt: new Date(),
      },
    },
    select: {
      user_id: true,
    },
  });

  return user?.user_id ?? null;

  // const result = await query(
  //   "SELECT user_id FROM sessions WHERE id = $1 AND expires_at > now()",
  //   [sessionToken]
  // );

  // return result.rows[0]?.user_id || null;
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  try {
    if (sessionToken) {
      await prisma.session.delete({
        where: {
          id: sessionToken,
        },
      });
      // await query("DELETE FROM sessions WHERE id = $1", [sessionToken]);
    }
  } catch (error) {
    console.error("Error deleting session:", error);
  } finally {
    cookieStore.delete({
      name: "session",
      path: "/",
    });
  }
};
