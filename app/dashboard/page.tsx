import { requireUser } from "@/lib/user";
import { getTodosByUser } from "@/lib/todos";
import Todos from "../components/todos/Todos";

export default async function Home() {
  const user = await requireUser();
  const todos = await getTodosByUser(user.id);

  return <Todos initialTodos={todos} />;
}
