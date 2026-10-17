import { z } from "zod";

const bdPhoneRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(bdPhoneRegex, {
    message: "Invalid Bangladeshi phone number format.",
  }),
//   password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
//     message:
//       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
//   }),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
  image: z.string().url().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type LoginFormValues = z.infer<typeof loginSchema>;