"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaValues,
} from "@/features/auth/schemas/auth.schemas";
import { authService } from "@/services/auth.service";

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ForgotPasswordSchemaValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const emailValue = watch("email");
  const formFilled = Boolean(emailValue && isValid);

  const mutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (_, variables) => {
      setEmailSent(variables.email);
    },
  });

  const onSubmit = (values: ForgotPasswordSchemaValues) => {
    mutation.mutate(values);
  };

  if (emailSent) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Link Sent</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-semibold text-gray-900">{emailSent}</span>.
            <br />
            <span className="text-gray-500 text-xs mt-2 block">
              The link expires in 15 minutes. Check your spam folder if you don&apos;t see it.
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/login">
            <Button
              size="lg"
              className="w-full h-12 rounded-full text-sm font-medium bg-[#6200EE] hover:bg-[#5400D0] text-white shadow-[0_8px_20px_-6px_rgba(98,0,238,0.4)]"
            >
              Return to Log in
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setEmailSent(null);
              mutation.reset();
            }}
            className="w-full h-12 rounded-full text-sm font-medium border-gray-200"
          >
            Use a different email
          </Button>
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Enter the email address associated with your admin account and
          we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gray-700">
            Email address
          </Label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              className="h-12 rounded-xl border-gray-200 text-sm pl-11 placeholder:text-gray-400 focus-visible:border-[#6200EE] focus-visible:ring-1 focus-visible:ring-[#6200EE]"
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
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
          {mutation.isPending ? "Sending link…" : "Send Reset Link"}
        </Button>

        {mutation.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Something went wrong. Please try again."}
          </div>
        ) : null}
      </form>
    </div>
  );
}