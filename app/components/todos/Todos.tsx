"use client";
import { Todo } from "@/types";
import { AddTodoButton } from "./AddTodoButton";
import {
  createTodoAction,
  deleteTodoAction,
  toggleTodoAction,
} from "@/app/actions/todos";

export default function Todos({ initialTodos }: { initialTodos: Todo[] }) {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">
        PostgreSQL Todo App
      </h1>

      <form action={createTodoAction} className="mb-6">
        <div className="flex gap-2">
          <input
            name="title"
            type="text"
            placeholder="Enter todo..."
            className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
          <AddTodoButton />
        </div>
      </form>

      <ul className="space-y-3">
        {initialTodos.map((todo) => (
          <li
            key={todo.id}
            className={`p-3 border rounded flex justify-between items-center transition-colors
              ${
                todo.is_completed
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-900 border-gray-700"
              }`}
          >
            <div className="flex items-center gap-3">
              <form action={toggleTodoAction}>
                <input type="hidden" name="id" value={todo.id} />
                <input
                  type="checkbox"
                  defaultChecked={todo.is_completed}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className="h-5 w-5 cursor-pointer text-blue-400 bg-gray-800 border-gray-600 rounded focus:ring-blue-400"
                />
              </form>
              <span
                className={`${
                  todo.is_completed
                    ? "line-through text-gray-400"
                    : "text-gray-100"
                }`}
              >
                {todo.title}
              </span>
            </div>
            <form action={deleteTodoAction}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                className="text-red-400 hover:text-red-300 cursor-pointer transition-colors"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
