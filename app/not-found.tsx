import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-100 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>

          <Link
            href=".."
            replace
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
