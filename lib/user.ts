import { cookies } from "next/headers";
// import { query } from "./db";
import { User } from "@/types";
import { prisma } from "./prisma";

export const requireUser = async (): Promise<User> => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) throw new Error("Unauthorized");

  const session = await prisma.session.findFirst({
    where: {
      id: sessionToken,
      expires_at: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
      },
    },
  });

  if (!session) throw new Error("Unauthorized");
  return session.user;

  // const result = await query<user>(
  //   "SELECT users.id, users.name, users.email, users.role, users.created_at FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = $1 AND sessions.expires_at > NOW()",
  //   [sessionToken]
  // );

  // if (result.rows.length === 0) throw new Error("Unauthorized");

  // return result.rows[0];
};
