import Link from "next/link";
import { verifySession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await verifySession();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-200 mb-4">
        Welcome to Todo App
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        A modern todo application with authentication, built with Next.js and
        PostgreSQL.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
