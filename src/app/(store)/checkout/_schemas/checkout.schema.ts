import { z } from "zod";
import { orderAddressSchema } from "@/lib/order-form";
export const checkoutFormSchema = z.object({
  savedAddressId: z.string(),
  address: orderAddressSchema,
  note: z.string().trim().max(1000),
});
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
