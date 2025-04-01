import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required." })
      .email("Please provide a valid email address."),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
    name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long."),
});

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address."),
});

export const requestPasswordResetSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: "Reset token is required." }),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
