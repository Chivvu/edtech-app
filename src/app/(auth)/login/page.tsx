import React from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="text-center flex flex-col items-center">
        <div className="relative mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/40 bg-black/70 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
          <img src="/logo.jpg" alt="EduFlow AI Logo" className="h-full w-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-1.5">
          EduFlow <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Internal Course Intelligence & Quality Governance Platform
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
