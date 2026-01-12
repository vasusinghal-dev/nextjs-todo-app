"use server";

import { softDeleteTodo } from "@/lib/todos";
import { requireUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function deleteTodoAction(formData: FormData) {
  const id = Number(formData.get("id"));

  await requireUser();

  const deleted = await softDeleteTodo(id);
  if (!deleted) throw new Error("Todo not found");

  revalidatePath("/dashboard");
}
