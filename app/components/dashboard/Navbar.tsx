"use client";
import { useActionState } from "react";
import Link from "next/link";
import { User } from "@/types";
import { logoutAction } from "@/app/actions/auth";

export default function Navbar({ user }: { user: User }) {
  const [, formAction, pending] = useActionState(logoutAction, null);

  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-400">
              Todo App
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">User: {user.name}</span>
            <form action={formAction}>
              <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? "Logging out..." : "Logout"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
