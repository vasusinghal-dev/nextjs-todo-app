"use server";

import { toggleTodo } from "@/lib/todos";
import { requireUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function toggleTodoAction(formData: FormData) {
  const id = Number(formData.get("id"));

  await requireUser();

  const todo = await toggleTodo(id);
  if (!todo) throw new Error("Todo not found");

  revalidatePath("/dashboard");
}
