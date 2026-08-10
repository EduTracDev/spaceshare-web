"use client";

import * as React from "react";
import { useForm, Controller, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { profileUpdateSchema } from "@/features/settings/schemas/settings.schemas";
import { settingsService } from "@/services/settings.service";
import { cn } from "@/lib/utils";

type ProfileFormValues = {
  fullName: string;
};

export function ProfileSettingsCard() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "profile"],
    queryFn: () => settingsService.getProfile(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    disabled: query.isLoading || query.isError,
    defaultValues: { fullName: "" },
    values: { fullName: query.data?.fullName ?? "" },
  });

  const emailValue = query.data?.email ?? "";

  React.useEffect(() => {
    if (query.data) {
      reset({ fullName: query.data.fullName }, { keepDefaultValues: true });
    }
  }, [query.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: { fullName: string }) =>
      settingsService.updateProfile(values),
    onSuccess: (result, variables) => {
      toast.success(result.message);
      reset({ fullName: variables.fullName });
      queryClient.invalidateQueries({ queryKey: ["settings", "profile"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    },
  });

  const onSubmit = (values: ProfileFormValues) =>
    mutation.mutate({ fullName: values.fullName });

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-0 px-6 pt-6 pb-2">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound size={20} />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold leading-tight text-foreground">
              Profile
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Update your name and contact email.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="settings-profile-fullname">
                    Full Name
                  </FieldLabel>
                  <Input
                    id="settings-profile-fullname"
                    {...field}
                    aria-invalid={Boolean(fieldState.error)}
                    className="h-12 rounded-2xl border-border bg-background px-4 text-[13.5px] placeholder:text-muted-foreground/70"
                    placeholder="Enter full name"
                  />
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="settings-profile-email">
                Email Address
              </FieldLabel>
              <Input
                id="settings-profile-email"
                value={emailValue}
                disabled
                className="h-12 rounded-2xl border-border bg-muted/30 px-4 text-[13.5px] text-muted-foreground"
              />
              <FieldDescription>
                Contact email is managed by platform administrators.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-start">
            <Button
              type="submit"
              size="lg"
              disabled={mutation.isPending || !isDirty || Object.keys(errors).length > 0}
              className={cn(
                "h-12 rounded-full px-7 text-[13.5px] font-semibold",
                isDirty && !mutation.isPending
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary/60 text-primary-foreground/90"
              )}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}