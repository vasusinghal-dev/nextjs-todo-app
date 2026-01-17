import Link from "next/link";
import AuthForm from "@/app/components/auth/AuthForm";
import { SocialButtons } from "@/app/components/auth/SocialButtons";
import { loginAction } from "@/app/actions/auth";

const AUTH_ERRORS = {
  oauth_failed: "Failed to connect. Please try again.",
  oauth_cancelled: "Login was cancelled.",
} as const;

function isAuthError(value: string): value is keyof typeof AUTH_ERRORS {
  return value in AUTH_ERRORS;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  const errorMessage =
    sp.error && isAuthError(sp.error) ? AUTH_ERRORS[sp.error] : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Social Login Buttons */}
        <SocialButtons error={errorMessage} />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <AuthForm type="login" action={loginAction} />
      </div>
    </div>
  );
}
