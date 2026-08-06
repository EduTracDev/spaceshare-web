"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Percent } from "lucide-react";
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
import { commissionUpdateSchema } from "@/features/settings/schemas/settings.schemas";
import type { PlatformCommission } from "@/features/settings/types/settings.types";
import { settingsService } from "@/services/settings.service";
import { cn } from "@/lib/utils";

type CommissionFormValues = PlatformCommission;

export function CommissionSettingsCard() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "commission"],
    queryFn: () => settingsService.getPlatformCommission(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionUpdateSchema),
    disabled: query.isLoading || query.isError,
    defaultValues: {
      hostCommissionPercent: 10,
      guestProcessingFeePercent: 5,
    },
    values: {
      hostCommissionPercent: query.data?.hostCommissionPercent ?? 10,
      guestProcessingFeePercent: query.data?.guestProcessingFeePercent ?? 5,
    },
  });

  React.useEffect(() => {
    if (query.data) {
      reset(query.data, { keepDefaultValues: true });
    }
  }, [query.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: CommissionFormValues) =>
      settingsService.updatePlatformCommission(values),
    onSuccess: (result, variables) => {
      toast.success(result.message);
      reset(variables);
      queryClient.invalidateQueries({
        queryKey: ["settings", "commission"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update commission settings"
      );
    },
  });

  const onSubmit = (values: CommissionFormValues) => mutation.mutate(values);

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-0 px-6 pt-6 pb-2">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Percent size={20} />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold leading-tight text-foreground">
              Commission
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Platform fees applied to every booking.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Controller
              name="hostCommissionPercent"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="settings-commission-host">
                    Host commission (%)
                  </FieldLabel>
                  <Input
                    id="settings-commission-host"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step="0.01"
                    aria-invalid={Boolean(fieldState.error)}
                    className="h-12 rounded-2xl border-border bg-background px-4 text-[13.5px] placeholder:text-muted-foreground/70"
                    {...field}
                    value={String(field.value)}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (raw === "") {
                        field.onChange(0);
                        return;
                      }
                      const value = Number(raw);
                      field.onChange(Number.isNaN(value) ? 0 : value);
                    }}
                  />
                  <FieldDescription>
                    Platform fees applied to every booking.
                  </FieldDescription>
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />

            <Controller
              name="guestProcessingFeePercent"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="settings-commission-guest">
                    Guest processing fee (%)
                  </FieldLabel>
                  <Input
                    id="settings-commission-guest"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step="0.01"
                    aria-invalid={Boolean(fieldState.error)}
                    className="h-12 rounded-2xl border-border bg-background px-4 text-[13.5px] placeholder:text-muted-foreground/70"
                    {...field}
                    value={String(field.value)}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (raw === "") {
                        field.onChange(0);
                        return;
                      }
                      const value = Number(raw);
                      field.onChange(Number.isNaN(value) ? 0 : value);
                    }}
                  />
                  <FieldDescription>
                    Charged to the guest on top of the booking total.
                  </FieldDescription>
                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex items-center justify-end pt-1">
            <Button
              type="submit"
              size="lg"
              disabled={
                mutation.isPending ||
                !isDirty ||
                Object.keys(errors).length > 0
              }
              className={cn(
                "h-12 rounded-full px-7 text-[13.5px] font-semibold",
                isDirty && !mutation.isPending
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary/60 text-primary-foreground/90"
              )}
            >
              {mutation.isPending ? "Saving..." : "Save Commission"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}