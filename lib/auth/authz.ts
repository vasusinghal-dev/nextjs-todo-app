import { UserRole } from "@/types";
import { requireUser } from "../user";

export const USER_ROLE: UserRole[] = ["user", "admin"];

const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  admin: 2,
};

const hasRequiredRole = (
  user_role: UserRole,
  required_role: UserRole
): boolean => {
  return roleHierarchy[user_role] >= roleHierarchy[required_role];
};

export const requiredRole = async (required_role: UserRole) => {
  const user = await requireUser();

  if (!user) throw new Error("Unauthorized: No authenticated user");

  const role = user.role as UserRole;

  if (!USER_ROLE.includes(role))
    throw new Error("Forbidden: Invalid user role");

  if (!hasRequiredRole(role, required_role)) {
    throw new Error(`Forbidden: Requires ${required_role} role`);
  }

  return user;
};
