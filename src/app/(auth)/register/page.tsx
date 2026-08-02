import React from "react";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-100">Register Organization</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Create a new EduFlow AI workspace for your institution.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
