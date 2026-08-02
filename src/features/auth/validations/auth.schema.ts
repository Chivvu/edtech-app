import { z } from "zod";

export const PasswordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(
    PasswordStrengthRegex,
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)."
  );

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid institutional email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
  twoFactorCode: z.string().length(6, "Two-factor code must be 6 digits.").optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid institutional email address."),
  password: PasswordSchema,
  organizationName: z.string().min(2, "Organization name is required."),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter your registered email address."),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required."),
});

export const TwoFactorSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Verification code must be 6 digits."),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type TwoFactorInput = z.infer<typeof TwoFactorSchema>;
