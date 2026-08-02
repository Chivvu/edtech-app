"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterInput, RegisterSchema } from "../validations/auth.schema";
import { registerAction } from "../actions/auth.actions";
import { Building2, User as UserIcon, Mail, Lock, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

export function RegisterForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organizationName: "",
    },
  });

  const passwordValue = watch("password", "");

  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[@$!%*?&]/.test(passwordValue);

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await registerAction(data);
      if (!result.success) {
        setErrorMessage(result.error || "Registration failed.");
      } else {
        setSuccessMessage(result.message || "Registration successful! Check your email to verify your account.");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
            Organization Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              {...register("organizationName")}
              type="text"
              placeholder="Acme Learning Technologies"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.organizationName && (
            <p className="mt-1 text-xs text-red-400">{errors.organizationName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              {...register("name")}
              type="text"
              placeholder="Dr. Sarah Jenkins"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
            Institutional Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              {...register("email")}
              type="email"
              placeholder="s.jenkins@acmelearning.com"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Password Strength Validation Indicator */}
          <div className="mt-2 space-y-1 rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5 text-[11px] text-neutral-400">
            <div className="font-semibold text-neutral-300">Password Requirements:</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className={hasMinLength ? "text-emerald-400" : "text-neutral-500"}>
                ✓ 8+ Characters
              </div>
              <div className={hasUppercase ? "text-emerald-400" : "text-neutral-500"}>
                ✓ 1 Uppercase Letter
              </div>
              <div className={hasLowercase ? "text-emerald-400" : "text-neutral-500"}>
                ✓ 1 Lowercase Letter
              </div>
              <div className={hasNumber ? "text-emerald-400" : "text-neutral-500"}>
                ✓ 1 Number
              </div>
              <div className={hasSpecialChar ? "text-emerald-400" : "text-neutral-500"}>
                ✓ 1 Special Character (@$!%*?&)
              </div>
            </div>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Workspace...</span>
            </>
          ) : (
            <span>Register Workspace</span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
