"use server";

import { createTodo } from "@/lib/todos";
import { requireUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function createTodoAction(formData: FormData) {
  const title = formData.get("title") as string;

  const user = await requireUser();
  await createTodo(user.id, title);

  revalidatePath("/dashboard");
}
