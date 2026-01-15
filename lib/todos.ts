import { Todo } from "@/types";
// import { query } from "./db";
import { prisma } from "./prisma";

export async function getTodosByUser(userId: number): Promise<Todo[]> {
  const todos = await prisma.todo.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    select: {
      id: true,
      title: true,
      is_completed: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return todos;

  // const result = await query<Todo>(
  //   `
  //   SELECT id, title, is_completed
  //   FROM todos
  //   WHERE user_id = $1
  //     AND deleted_at IS NULL
  //   ORDER BY id DESC
  //   `,
  //   [userId]
  // );

  // return result.rows;
}

export async function createTodo(userId: number, title: string): Promise<Todo> {
  const todo = await prisma.todo.create({
    data: {
      user_id: userId,
      title: title,
    },
    select: {
      id: true,
      title: true,
      is_completed: true,
    },
  });

  return todo;

  // const result = await query<Todo>(
  //   `
  //   INSERT INTO todos (user_id, title)
  //   VALUES ($1, $2)
  //   RETURNING id, title, is_completed
  //   `,
  //   [userId, title]
  // );

  // return result.rows[0];
}

export async function toggleTodo(todoId: number): Promise<Todo | null> {
  const result = await prisma.$queryRaw<Todo[]>`
    UPDATE todo
    SET is_completed = NOT is_completed
    WHERE id = ${todoId} 
    AND deleted_at IS NULL
    RETURNING id, title, is_completed
  `;

  return result[0] ?? null;

  // const result = await query<Todo>(
  //   `
  //   UPDATE todos
  //   SET is_completed = NOT is_completed
  //   WHERE id = $1
  //   AND deleted_at IS NULL
  //   RETURNING id, title, is_completed
  //   `,
  //   [todoId]
  // );

  // return result.rows[0] ?? null;
}

export async function softDeleteTodo(
  todoId: number
): Promise<{ id: number } | null> {
  const result = await prisma.$queryRaw<Todo[]>`
    UPDATE todo
    SET deleted_at = now()
    WHERE id = ${todoId} AND deleted_at IS NULL
    RETURNING id
  `;

  return result[0] ?? null;

  // const result = await query(
  //   `
  //   UPDATE todos
  //   SET deleted_at = now()
  //   WHERE id = $1 AND deleted_at IS NULL
  //   RETURNING id
  //   `,
  //   [todoId]
  // );

  // return result.rows[0] ?? null;
}
