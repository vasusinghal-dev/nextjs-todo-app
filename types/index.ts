export { UserRole, OAuthProvider } from "@prisma/client";
import { todo as PrismaTodo, user as PrismaUser } from "@prisma/client";

// Your custom types
export type Todo = Pick<PrismaTodo, "id" | "title" | "is_completed">;
export type User = Pick<
  PrismaUser,
  "id" | "name" | "email" | "role" | "created_at"
>;
