import * as z from "zod";

export const profileUpdateSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(120, "Full name must be at most 120 characters"),
});

export const commissionUpdateSchema = z.object({
  hostCommissionPercent: z
    .number({
      required_error: "Host commission is required",
      invalid_type_error: "Host commission must be a number",
    })
    .min(0, "Host commission cannot be negative")
    .max(100, "Host commission cannot exceed 100%"),
  guestProcessingFeePercent: z
    .number({
      required_error: "Guest processing fee is required",
      invalid_type_error: "Guest processing fee must be a number",
    })
    .min(0, "Guest processing fee cannot be negative")
    .max(100, "Guest processing fee cannot exceed 100%"),
});

const MIN_PASSWORD_LENGTH = 8;

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(MIN_PASSWORD_LENGTH, `At least ${MIN_PASSWORD_LENGTH} characters`),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(MIN_PASSWORD_LENGTH, `At least ${MIN_PASSWORD_LENGTH} characters`),
});

export type PasswordChangeSchemaValues = z.infer<typeof passwordChangeSchema>;
