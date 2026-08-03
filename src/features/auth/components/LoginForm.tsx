"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  type LoginSchemaValues,
} from "@/features/auth/schemas/auth.schemas";
import { authService } from "@/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const formFilled = Boolean(emailValue && passwordValue && isValid);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });

  const onSubmit = (values: LoginSchemaValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-full relative">
        {mutation.isError ? (
          <div className="absolute top-[-90] right-10 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-bold text-red-600">
            {mutation?.error instanceof Error
              ? mutation.error?.message
              : "Invalid email or password. please try again"}
          </div>
        ) : null}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Sign in to access the SpaceShare Admin Dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2 mb-0">
          <Label htmlFor="email" className="text-sm text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            className="h-12 rounded-xl border-gray-200 text-sm placeholder:text-gray-400 focus-visible:border-[#6200EE] focus-visible:ring-1 focus-visible:ring-[#6200EE] bg-white"
            {...register("email")}
          />
          <div className="h-6 flex mb-1">
            {errors.email ? (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Set your password"
              className="h-12 rounded-xl border-gray-200 text-sm placeholder:text-gray-400 pr-12 focus-visible:border-[#6200EE] focus-visible:ring-1 focus-visible:ring-[#6200EE] bg-white"
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="h-6 flex mb-1">
            {errors.password ? (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <div className="text-sm">
            <span className="text-gray-500">Forgot Password?</span>{" "}
            <Link
              href="/forgot-password"
              className="text-[#6200EE] font-medium hover:underline underline-offset-2"
            >
              Reset here
            </Link>
          </div>
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
          {mutation.isPending ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </div>
  );
}