import { z } from "zod";
import { isMobileValid } from "./account.schema";

export const addressFormSchema = z.object({
  label: z.string().trim().max(100),
  recipientName: z
    .string()
    .trim()
    .min(1, "Recipient name is required")
    .max(100),
  recipientPhone: z
    .string()
    .trim()
    .max(20)
    .refine(isMobileValid, "Enter a valid mobile number"),
  district: z.string().trim().min(1, "District is required").max(100),
  area: z.string().trim().min(1, "Area is required").max(100),
  addressLine: z.string().trim().min(1, "Address is required").max(500),
  postalCode: z.string().trim().max(20),
  zone: z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"]),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
