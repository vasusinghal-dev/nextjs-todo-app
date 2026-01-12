"use client";

import { useFormStatus } from "react-dom";

export function AddTodoButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}
