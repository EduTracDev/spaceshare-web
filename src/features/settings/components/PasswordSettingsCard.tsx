"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Check, Eye, EyeOff, Lock, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  passwordChangeSchema,
  type PasswordChangeSchemaValues,
} from "@/features/settings/schemas/settings.schemas";
import { settingsService } from "@/services/settings.service";
import { cn } from "@/lib/utils";

type PasswordStrengthIssues = {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
};

const PASSWORD_STRENGTH_RULES: Array<{
  key: keyof PasswordStrengthIssues;
  label: string;
}> = [
  { key: "length", label: "At least 8 characters" },
  { key: "uppercase", label: "One uppercase letter" },
  { key: "number", label: "One number" },
  { key: "special", label: "One special character (e.g., !, @, #)" },
];

function evaluatePassword(value: string): PasswordStrengthIssues {
  return {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(value),
  };
}

export function PasswordSettingsCard() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeSchemaValues>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") ?? "";
  const strength = React.useMemo(
    () => evaluatePassword(newPasswordValue),
    [newPasswordValue]
  );

  const mutation = useMutation({
    mutationFn: (values: PasswordChangeSchemaValues) =>
      settingsService.changePassword(values),
    onSuccess: (result) => {
      toast.success(result.message);
      reset();
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update password";
      if (message === "Input the correct password") {
        setError("currentPassword", { type: "manual", message });
        return;
      }
      toast.error(message);
    },
  });

  const allRulesPassed =
    strength.length && strength.uppercase && strength.number && strength.special;

  const submitEnabled =
    !mutation.isPending &&
    allRulesPassed &&
    Boolean(watch("currentPassword")) &&
    Boolean(watch("newPassword")) &&
    Object.keys(errors).length === 0;

  const onSubmit = (values: PasswordChangeSchemaValues) => {
    clearErrors("currentPassword");
    mutation.mutate(values);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-0 px-6 pt-6 pb-2">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold leading-tight text-foreground">
              Password
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Change the password used to sign in.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field, fieldState }) => {
                const invalid = Boolean(fieldState.error);
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor="settings-password-current">
                      Current Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="settings-password-current"
                        type={showCurrent ? "text" : "password"}
                        placeholder="Enter your current password"
                        aria-invalid={invalid}
                        className={cn(
                          "h-12 rounded-2xl border-border bg-background pr-12 pl-4 text-[13.5px] placeholder:text-muted-foreground/70",
                          invalid &&
                            "border-red-400 focus-visible:ring-red-400/30"
                        )}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        tabIndex={-1}
                        onClick={() => setShowCurrent((prev) => !prev)}
                        aria-label={
                          showCurrent ? "Hide password" : "Show password"
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    {fieldState.error ? (
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-red-600">
                        <AlertTriangle size={13} />
                        {fieldState.error.message}
                      </div>
                    ) : null}
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : []}
                      className="sr-only"
                    />
                  </Field>
                );
              }}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="settings-password-new">
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="settings-password-new"
                      type={showNew ? "text" : "password"}
                      placeholder="Enter your new password"
                      aria-invalid={Boolean(fieldState.error)}
                      className="h-12 rounded-2xl border-border bg-background pr-12 pl-4 text-[13.5px] placeholder:text-muted-foreground/70"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      tabIndex={-1}
                      onClick={() => setShowNew((prev) => !prev)}
                      aria-label={
                        showNew ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />
          </FieldGroup>

          <ul className="space-y-1.5 text-[12.5px]">
            {PASSWORD_STRENGTH_RULES.map((rule) => {
              const passed = strength[rule.key];
              return (
                <li
                  key={rule.key}
                  className={cn(
                    "flex items-center gap-2 font-medium",
                    passed ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                      passed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted text-muted-foreground/40"
                    )}
                  >
                    {passed ? (
                      <Check size={11} strokeWidth={2.5} />
                    ) : (
                      <X size={10} strokeWidth={3} />
                    )}
                  </span>
                  {rule.label}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end pt-1">
            <Button
              type="submit"
              size="lg"
              disabled={!submitEnabled}
              className={cn(
                "h-12 rounded-full px-7 text-[13.5px] font-semibold",
                submitEnabled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary/60 text-primary-foreground/90"
              )}
            >
              {mutation.isPending ? "Saving..." : "Change Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}