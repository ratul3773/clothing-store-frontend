import { z } from "zod";
import type { OrderAddress } from "@/redux/apis/types/order.types";

const text = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max);
export const orderAddressSchema = z.object({
  recipientName: text("Recipient name", 100),
  recipientPhone: z
    .string()
    .trim()
    .max(20)
    .refine(
      (value) => /^(?:\+?88)?01[3-9]\d{8}$/.test(value.replace(/[\s()-]/g, "")),
      "Enter a valid Bangladesh mobile number",
    ),
  district: text("District", 100),
  area: text("Area", 100),
  addressLine: text("Address", 500),
  postalCode: z.string().trim().max(20),
  zone: z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"]),
});
export const emptyOrderAddress = {
  recipientName: "",
  recipientPhone: "",
  district: "",
  area: "",
  addressLine: "",
  postalCode: "",
  zone: "INSIDE_DHAKA" as const,
};
export const addressFieldLabels = {
  recipientName: "Recipient name",
  recipientPhone: "Mobile number",
  district: "District",
  area: "Area / thana",
  addressLine: "Delivery address",
  postalCode: "Postal code (optional)",
  zone: "Delivery zone",
} as const;
export const zoneOptions = [
  { value: "INSIDE_DHAKA", label: "Inside Dhaka" },
  { value: "OUTSIDE_DHAKA", label: "Outside Dhaka" },
];
export const orderAddressPayload = (
  address: z.infer<typeof orderAddressSchema>,
): OrderAddress => ({ ...address, postalCode: address.postalCode || null });
export const integerField = (min: number, max: number) =>
  z
    .string()
    .regex(/^\d+$/, "Enter a whole number")
    .refine(
      (value) => Number(value) >= min && Number(value) <= max,
      `Enter a number from ${min} to ${max}`,
    );
