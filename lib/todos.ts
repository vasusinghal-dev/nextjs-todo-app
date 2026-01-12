import { Todo } from "@/types";
import { query } from "./db";

export async function getTodosByUser(userId: number): Promise<Todo[]> {
  const result = await query<Todo>(
    `
    SELECT id, title, is_completed
    FROM todos
    WHERE user_id = $1
      AND deleted_at IS NULL
    ORDER BY id DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function createTodo(userId: number, title: string): Promise<Todo> {
  const result = await query<Todo>(
    `
    INSERT INTO todos (user_id, title)
    VALUES ($1, $2)
    RETURNING id, title, is_completed
    `,
    [userId, title]
  );

  return result.rows[0];
}

export async function toggleTodo(todoId: number): Promise<Todo | null> {
  const result = await query<Todo>(
    `
    UPDATE todos
    SET is_completed = NOT is_completed
    WHERE id = $1 
    AND deleted_at IS NULL
    RETURNING id, title, is_completed
    `,
    [todoId]
  );

  return result.rows[0] ?? null;
}

export async function softDeleteTodo(
  todoId: number
): Promise<{ id: number } | null> {
  const result = await query(
    `
    UPDATE todos
    SET deleted_at = now()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING id
    `,
    [todoId]
  );

  return result.rows[0] ?? null;
}
