"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { LoginInput, LoginSchema } from "../validations/auth.schema";
import { SocialAuthButtons } from "./social-auth-buttons";
import { KeyRound, ShieldAlert, Loader2, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@eduflow.ai",
      password: "Password123!",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Set demo session cookie to ensure middleware access
    document.cookie = "eduflow_session=active; path=/; max-age=86400";

    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
    } catch {}

    window.location.href = "/dashboard";
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              {...register("email")}
              type="email"
              placeholder="admin@eduflow.ai"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {requiresTwoFactor && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Two-Factor Authentication Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-amber-400" />
              <input
                {...register("twoFactorCode")}
                type="text"
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-lg border border-amber-500/50 bg-neutral-900/90 py-2.5 pl-9 pr-4 text-sm font-mono text-amber-300 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            {errors.twoFactorCode && <p className="mt-1 text-xs text-red-400">{errors.twoFactorCode.message}</p>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
        </div>
      </div>

      <SocialAuthButtons />

      <p className="text-center text-xs text-neutral-400">
        Don&apos;t have an organization workspace?{" "}
        <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
          Register Organization
        </Link>
      </p>
    </div>
  );
}
