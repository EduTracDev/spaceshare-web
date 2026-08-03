"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordSchema,
  type ResetPasswordSchemaValues,
} from "@/features/auth/schemas/auth.schemas";
import { authService } from "@/services/auth.service";

function getStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string; className: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map: Record<number, { label: string; className: string }> = {
    0: { label: "Too weak", className: "bg-gray-200 w-1/4" },
    1: { label: "Weak", className: "bg-red-400 w-1/4" },
    2: { label: "Fair", className: "bg-orange-400 w-2/4" },
    3: { label: "Good", className: "bg-yellow-400 w-3/4" },
    4: { label: "Strong", className: "bg-green-500 w-full" },
  };
  return { score: score as 0 | 1 | 2 | 3 | 4, ...map[score] };
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "mock-reset-token";

  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [passwordUpdated, setPasswordUpdated] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ResetPasswordSchemaValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");
  const confirmValue = watch("confirmPassword");
  const strength = getStrength(passwordValue);
  const formFilled = Boolean(passwordValue && confirmValue && isValid);

  const mutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => setPasswordUpdated(true),
  });

  const onSubmit = (values: ResetPasswordSchemaValues) => {
    mutation.mutate({ token, password: values.password, confirmPassword: values.confirmPassword });
  };

  if (passwordUpdated) {
    return (
      <div className="w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-10 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Log in
        </Link>

        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your password has been updated successfully. You can now sign in with
            your new password.
          </p>
        </div>

        <Link href="/login">
          <Button
            size="lg"
            className="w-full h-12 rounded-full text-sm font-medium bg-[#6200EE] hover:bg-[#5400D0] text-white shadow-[0_8px_20px_-6px_rgba(98,0,238,0.4)]"
          >
            Go to Log in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-10 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Log in
      </Link>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-gray-700">
            New Password
          </Label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              className="h-12 rounded-xl border-gray-200 text-sm pl-11 pr-12 placeholder:text-gray-400 focus-visible:border-[#6200EE] focus-visible:ring-1 focus-visible:ring-[#6200EE]"
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPwd ? "Hide password" : "Show password"}
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Strength bar */}
          {passwordValue ? (
            <div className="pt-1">
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={"h-full transition-all duration-200 rounded-full " + strength.className}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-gray-500">
                  Strength:{" "}
                  <span
                    className={
                      strength.score >= 3
                        ? "text-green-600 font-medium"
                        : strength.score >= 2
                        ? "text-orange-600 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {strength.label}
                  </span>
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-[10px] text-gray-500">
                {[
                  { ok: passwordValue.length >= 8, label: "At least 8 characters" },
                  { ok: /[A-Z]/.test(passwordValue), label: "One uppercase letter" },
                  { ok: /[0-9]/.test(passwordValue), label: "One number" },
                  { ok: /[^A-Za-z0-9]/.test(passwordValue), label: "One special character" },
                ].map((r) => (
                  <li key={r.label} className="flex items-center gap-1.5">
                    <span
                      className={
                        "inline-flex items-center justify-center w-3.5 h-3.5 rounded-full " +
                        (r.ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400")
                      }
                    >
                      {r.ok ? "✓" : "•"}
                    </span>
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {errors.password ? (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          ) : null}
        </div>

        {/* Confirm */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-gray-700">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className="h-12 rounded-xl border-gray-200 text-sm pl-11 pr-12 placeholder:text-gray-400 focus-visible:border-[#6200EE] focus-visible:ring-1 focus-visible:ring-[#6200EE]"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!formFilled || mutation.isPending}
          className={
            "w-full h-12 rounded-full text-sm font-medium transition-all " +
            (formFilled && !mutation.isPending
              ? "bg-[#6200EE] hover:bg-[#5400D0] text-white shadow-[0_8px_20px_-6px_rgba(98,0,238,0.4)]"
              : "bg-[#D1C4FE] text-white cursor-not-allowed shadow-none hover:bg-[#D1C4FE]")
          }
        >
          {mutation.isPending ? "Updating password…" : "Reset Password"}
        </Button>

        {mutation.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Password reset failed. Please try again."}
          </div>
        ) : null}
      </form>
    </div>
  );
}