import { settings } from "@/data/site";
import { z } from "zod";
import { validateAccount, validateDelivery, validateOrders, validateSeo, validateStore } from "../_utils/settings.utils";

export const storeSchema = z.object({
  name: z.string(), tagline: z.string(), email: z.string(), phone: z.string(), whatsapp: z.string(), address: z.string(),
}).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateStore(values))) {
    if (message) ctx.addIssue({ code: "custom", path: [key], message });
  }
});

export const ordersSchema = z.object({
  prefix: z.string(), exchangeDays: z.number(), lowStock: z.number(), autoConfirm: z.boolean(),
}).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateOrders(values))) {
    if (message) ctx.addIssue({ code: "custom", path: [key], message });
  }
});

export const deliverySchema = z.object({
  delivery: z.object({ dhaka: z.number(), outside: z.number(), freeAbove: z.number() }),
  payments: z.object({ cod: z.boolean(), online: z.boolean() }),
}).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateDelivery(values.delivery, values.payments))) {
    if (message) ctx.addIssue({ code: "custom", path: key === "payments" ? ["payments", "cod"] : ["delivery", key], message });
  }
});

export const seoSchema = z.object({
  seo: z.object({ title: z.string(), description: z.string() }),
  social: z.object({ facebook: z.string(), instagram: z.string() }),
}).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateSeo(values.seo, values.social))) {
    if (message) ctx.addIssue({ code: "custom", path: [key === "title" || key === "description" ? "seo" : "social", key], message });
  }
});

export const accountSchema = z.object({
  name: z.string(), email: z.string(), current: z.string(), next: z.string(), confirm: z.string(),
}).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateAccount(values, values, settings.admin.password))) {
    if (message) ctx.addIssue({ code: "custom", path: [key], message });
  }
});

export const announcementsSchema = z.object({
  messages: z.array(z.object({ text: z.string().refine((value) => !!value.trim(), "Remove or fill empty messages") })),
});
