"use client";

import { useActionState } from "react";

interface AuthFormProps {
  type: "login" | "signup";
  action: (
    prevState: { error?: string },
    formData: FormData
  ) => Promise<{ error?: string }>;
}
export default function AuthForm({ type, action }: AuthFormProps) {
  const initialState = { error: undefined };
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form className="mt-8 space-y-6" action={formAction}>
      <div className="rounded-md shadow-sm -space-y-px">
        {type === "signup" && (
          <div>
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
              disabled={pending}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            disabled={pending}
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              type === "login" ? "current-password" : "new-password"
            }
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            disabled={pending}
          />
        </div>
      </div>

      {state?.error && (
        <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded">
          {state.error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Processing…" : type === "login" ? "Sign in" : "Sign up"}
        </button>
      </div>
    </form>
  );
}
