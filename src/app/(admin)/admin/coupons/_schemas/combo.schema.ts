import { z } from "zod";
import { comboDraftPricing } from "@/lib/combo-pricing";
import { fromDhakaInput } from "../_utils/combo-dates";

const componentSchema = z.object({
  id: z.string().min(1),
  colorId: z.string().min(1),
  quantity: z
    .number({ error: "Enter a component quantity." })
    .int()
    .min(1)
    .max(3),
  product: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    imageUrl: z.string().nullable(),
    unitPrice: z.number().int().nonnegative(),
  }),
  color: z.object({
    id: z.string(),
    name: z.string(),
    hex: z.string().nullable(),
  }),
  variants: z.array(
    z.object({
      id: z.string(),
      size: z.string(),
      available: z.number(),
      maxQuantity: z.number(),
    }),
  ),
});
const schedule = z.string().refine((value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return false;
  try {
    return !!fromDhakaInput(value);
  } catch {
    return false;
  }
}, "Enter a valid Asia/Dhaka date and time.");

export const comboFormSchema = z
  .object({
    name: z
      .string()
      .refine(
        (value) => value.trim().length >= 1 && value.trim().length <= 200,
        "Name must contain 1 to 200 characters.",
      ),
    description: z
      .string()
      .refine(
        (value) => value.trim().length <= 10000,
        "Description must not exceed 10,000 characters.",
      ),
    price: z
      .string()
      .refine(
        (value) =>
          /^\d+$/.test(value) &&
          Number(value) >= 1 &&
          Number(value) <= 2147483647,
        "Enter an integer price from 1 to 2,147,483,647 taka.",
      ),
    isActive: z.boolean(),
    startsAt: schedule,
    endsAt: schedule,
    items: z.array(componentSchema).superRefine((items, context) => {
      const pieces = items.reduce((sum, item) => sum + item.quantity, 0);
      if (pieces !== 2 && pieces !== 3)
        context.addIssue({
          code: "custom",
          message: "A combo must contain two or three physical pieces.",
        });
      if (new Set(items.map((item) => item.colorId)).size !== items.length)
        context.addIssue({
          code: "custom",
          message: "Combine repeated product colors into one quantity.",
        });
    }),
  })
  .superRefine((draft, context) => {
    const pricing = comboDraftPricing(draft.items, Number(draft.price));
    if (!Number.isFinite(pricing.combinedPrice) || pricing.combinedPrice <= 0)
      context.addIssue({
        code: "custom",
        path: ["items"],
        message: "Item prices are unavailable. Reload the selected products.",
      });
    // The backend enforces this rule on create and edit, so it blocks submission.
    else if (Number(draft.price) >= pricing.combinedPrice)
      context.addIssue({
        code: "custom",
        path: ["price"],
        message:
          "Combo price must be lower than the combined current price of its items.",
      });
    try {
      const start = fromDhakaInput(draft.startsAt),
        end = fromDhakaInput(draft.endsAt);
      if (start && end && start >= end)
        context.addIssue({
          code: "custom",
          path: ["endsAt"],
          message: "Start must be before end.",
        });
    } catch {
      /* The schedule fields report invalid input. */
    }
  });
