"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user.service";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
});

type SchemaValues = z.infer<typeof schema>;

interface InviteAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteAdminDialog({
  open,
  onOpenChange,
  onSuccess,
}: InviteAdminDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "" },
  });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const name = watch("fullName");
  const email = watch("email");
  const filled = Boolean(name && email && isValid);

  const mutation = useMutation({
    mutationFn: (v: SchemaValues) =>
      userService.inviteAdmin({
        fullName: v.fullName.trim(),
        email: v.email.trim(),
        role: "admin",
      }),
    onSuccess: (r) => {
      toast.success(r.message);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (e) => {
      toast.error(
        e instanceof Error ? e.message : "Failed to send invite. Please try again."
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="text-[19px] font-bold tracking-tight">
            Invite Admin User
          </DialogTitle>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
            Send an invitation email to a new admin. They&apos;ll receive a link to set up their password and access the dashboard.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="px-6 py-5 space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-[13px] font-medium text-foreground/80">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Enter admin's full name"
              className="h-11 rounded-xl border-border text-[13px] placeholder:text-muted-foreground/70"
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="text-red-500 text-[11.5px]">{errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium text-foreground/80">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter admin's email address"
              className="h-11 rounded-xl border-border text-[13px] placeholder:text-muted-foreground/70"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-red-500 text-[11.5px]">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/60 -mx-6 px-6 pt-4 mt-3 bg-muted/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-full px-5 text-[13px] font-semibold border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!filled || mutation.isPending}
              className={cn(
                "h-10 rounded-full px-5 text-[13px] font-semibold transition-all",
                filled && !mutation.isPending
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_6px_16px_-6px_rgba(98,0,238,0.5)]"
                  : "bg-brand-200 text-white cursor-not-allowed shadow-none hover:bg-brand-200"
              )}
            >
              {mutation.isPending ? "Sending invite…" : "Send Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}