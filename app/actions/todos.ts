"use server";

import { createTodo, toggleTodo, softDeleteTodo } from "@/lib/todos";
import { requireUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function createTodoAction(formData: FormData) {
  const title = formData.get("title") as string;

  const user = await requireUser();
  await createTodo(user.id, title);

  revalidatePath("/dashboard");
}

export async function toggleTodoAction(formData: FormData) {
  const id = Number(formData.get("id"));

  await requireUser();

  const todo = await toggleTodo(id);
  if (!todo) throw new Error("Todo not found");

  revalidatePath("/dashboard");
}

export async function deleteTodoAction(formData: FormData) {
  const id = Number(formData.get("id"));

  await requireUser();

  const deleted = await softDeleteTodo(id);
  if (!deleted) throw new Error("Todo not found");

  revalidatePath("/dashboard");
}
