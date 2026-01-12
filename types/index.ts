export type UserRole = "user" | "admin";

export type user = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
};

export type Todo = {
  title: string;
  id: number;
  is_completed: boolean;
};
