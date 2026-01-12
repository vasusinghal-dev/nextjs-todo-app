"use client";
import { useEffect } from "react";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Something went wrong!
        </h1>

        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-300 font-medium mb-2">Error Details:</p>
          <p className="text-red-400 text-sm">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-red-500 text-xs mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <p className="text-gray-400 mb-8">
          We apologize for the inconvenience. Please try again or return to the
          home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
