"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { OAuthProvider } from "@/types";
import { oAuthAction } from "@/app/actions/oauth";

export const SocialButtons = ({ error }: { error?: string }) => {
  const googleAction = oAuthAction.bind(null, OAuthProvider.google);
  const githubAction = oAuthAction.bind(null, OAuthProvider.github);

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded">
          {error}
        </div>
      )}

      <form action={googleAction}>
        <button
          type="submit"
          value="google"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      </form>

      <form action={githubAction}>
        <button
          type="submit"
          value="github"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-800 rounded-md shadow-sm bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <FaGithub className="w-5 h-5" />
          <span>Continue with GitHub</span>
        </button>
      </form>
    </div>
  );
};
