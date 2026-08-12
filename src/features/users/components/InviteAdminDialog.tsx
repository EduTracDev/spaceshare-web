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
import { UserPlus } from "lucide-react";

const schema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string({ message: "Last name is required" })
    .trim()
    .min(2, "Last name must be at least 2 characters"),
  email: z
    .string({ message: "Email is required" })
    .email("Enter a valid email address"),
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
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const filled = Boolean(firstName && lastName && email && isValid);

  const mutation = useMutation({
    mutationFn: (v: SchemaValues) =>
      userService.inviteAdmin({
        fullName: `${v.firstName.trim()} ${v.lastName.trim()}`,
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
      <DialogContent className="h-max-[80vh] md:max-w-[70vw] lg:max-w-[600px] rounded-3xl px-2 py-4 md:py-6 overflow-hidden">
        <DialogHeader className="px-6 pt-0 md:pt-6">
          <span className="hidden md:block">
            <UserPlus size={24} strokeWidth={1.9} />
          </span>
          <DialogTitle className="text-[19px] font-bold tracking-tight mt-2">
            Invite Admin User
          </DialogTitle>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
            Invite a new administrator by entering their details. They&apos;ll receive an email with instructions to setup their account.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="px-6 pt-3 pb-5 space-y-3 md:space-y-2"
          noValidate
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="firstName"
                className="text-[13px] font-medium text-foreground/80"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="h-11 rounded-xl border-border text-[13px] placeholder:text-muted-foreground/70"
                {...register("firstName")}
              />
              <div className="text-red-500 text-[11.5px] min-h-4 md:min-h-6" >
                {errors.firstName ? (
                  <p className="">
                    {errors.firstName.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="lastName"
                className="text-[13px] font-medium text-foreground/80"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="h-11 rounded-xl border-border text-[13px] placeholder:text-muted-foreground/70"
                {...register("lastName")}
              />
              <div className="min-h-4 md:min-h-6">
                {errors.lastName ? (
                  <p className="text-red-500 text-[11.5px]">
                    {errors.lastName.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-[13px] font-medium text-foreground/80"
            >
              Admin Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@email.com"
              className="h-11 rounded-xl border-border text-[13px] placeholder:text-muted-foreground/70"
              {...register("email")}
            />
            <div className="min-h-4 md:min-h-6">
              {errors.email ? (
                <p className="text-red-500 text-[11.5px]">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-3 -mx-6 px-6 pt-4 md:mt-3 sm:grid-cols-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-full px-5 text-[14px] font-semibold border-border bg-background text-primary hover:text-primary hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!filled || mutation.isPending}
              className={cn(
                "h-12 rounded-full px-5 text-[14px] font-semibold transition-all",
                filled && !mutation.isPending
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_6px_16px_-6px_rgba(98,0,238,0.5)]"
                  : "bg-primary/60 text-primary-foreground/90 cursor-not-allowed shadow-none hover:bg-primary/60"
              )}
            >
              {mutation.isPending ? "Sending invitation…" : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}