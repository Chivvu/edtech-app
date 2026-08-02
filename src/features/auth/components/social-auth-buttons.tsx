"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Globe } from "lucide-react";

export function SocialAuthButtons() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <Globe className="h-4 w-4 text-indigo-400" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
