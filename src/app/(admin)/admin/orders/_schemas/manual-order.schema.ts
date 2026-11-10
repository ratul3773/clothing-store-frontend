import { z } from "zod";
import { integerField, orderAddressSchema } from "@/lib/order-form";
import type { ManualOrderPayload } from "@/redux/apis/types/order.types";
import { orderAddressPayload } from "@/lib/order-form";

const line = z
  .object({
    type: z.enum(["VARIANT", "COMBO"]),
    catalogId: z.string().uuid(),
    name: z.string(),
    variantId: z.string(),
    quantity: integerField(1, 50),
    selections: z
      .array(
        z.object({ comboItemId: z.string().uuid(), variantId: z.string() }),
      )
      .max(3),
  })
  .superRefine((value, context) => {
    if (
      value.type === "VARIANT" &&
      !z.string().uuid().safeParse(value.variantId).success
    )
      context.addIssue({
        code: "custom",
        path: ["variantId"],
        message: "Choose a colour and size",
      });
    if (value.type === "COMBO") {
      if (!value.selections.length)
        context.addIssue({
          code: "custom",
          path: ["selections"],
          message: "Choose all combo sizes",
        });
      value.selections.forEach((selection, index) => {
        if (!z.string().uuid().safeParse(selection.variantId).success)
          context.addIssue({
            code: "custom",
            path: ["selections", index, "variantId"],
            message: "Choose this component's size",
          });
      });
    }
  });
export const manualOrderFormSchema = z
  .object({
    address: orderAddressSchema,
    customerSearch: z.string().trim().max(100),
    customerId: z.string(),
    catalogSearch: z.string().trim().max(100),
    source: z.enum([
      "ADMIN_MANUAL",
      "WHATSAPP",
      "FACEBOOK",
      "INSTAGRAM",
      "PHONE",
    ]),
    status: z.enum(["PENDING_CONFIRMATION", "CONFIRMED"]),
    lines: z.array(line).min(1, "Add at least one product or combo").max(50),
    discount: integerField(0, 2_147_483_647),
    deliveryOverride: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (/^\d+$/.test(value) && Number(value) <= 2_147_483_647),
        "Enter a nonnegative whole amount",
      ),
    adjustmentReason: z.string().trim().max(500),
    note: z.string().trim().max(1000),
  })
  .refine(
    (value) =>
      !(Number(value.discount) || value.deliveryOverride !== "") ||
      !!value.adjustmentReason,
    {
      path: ["adjustmentReason"],
      message: "Explain the discount or delivery override",
    },
  );
export type ManualOrderFormValues = z.infer<typeof manualOrderFormSchema>;
export const manualOrderPayload = (
  value: ManualOrderFormValues,
): Omit<ManualOrderPayload, "expected"> => ({
  lines: value.lines.map((item) =>
    item.type === "VARIANT"
      ? {
          type: "VARIANT",
          variantId: item.variantId,
          quantity: Number(item.quantity),
        }
      : {
          type: "COMBO",
          comboId: item.catalogId,
          quantity: Number(item.quantity),
          selections: item.selections,
        },
  ),
  destination: { address: orderAddressPayload(value.address) },
  ...(value.customerId !== "none" ? { customerId: value.customerId } : {}),
  source: value.source,
  status: value.status,
  discount: Number(value.discount),
  ...(value.deliveryOverride !== ""
    ? { deliveryOverride: Number(value.deliveryOverride) }
    : {}),
  ...(value.adjustmentReason
    ? { adjustmentReason: value.adjustmentReason }
    : {}),
  ...(value.note ? { note: value.note } : {}),
});
