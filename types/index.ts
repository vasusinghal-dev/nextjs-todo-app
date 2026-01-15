import type {
  Todo as PrismaTodo,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from "@prisma/client";

// Your custom types
export type Todo = Pick<PrismaTodo, "id" | "title" | "is_completed">;
export type User = Pick<
  PrismaUser,
  "id" | "name" | "email" | "role" | "created_at"
>;
export type UserRole = PrismaUserRole;
