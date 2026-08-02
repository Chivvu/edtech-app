import React from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-100">Sign in to your organization</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Access internal course intelligence & quality governance.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
