import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 text-neutral-50">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">EduFlow AI</h1>
          <p className="text-sm text-neutral-400">Internal Course Intelligence Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}
