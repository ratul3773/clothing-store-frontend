import { z } from "zod";
import { validateBanner } from "../_utils/banner.utils";

export const bannerFormSchema = z
  .object({
    title: z.string(),
    subtitle: z.string(),
    image: z.string(),
    ctaLabel: z.string(),
    ctaLink: z.string(),
    placement: z.enum(["hero", "promo"]),
    order: z.string(),
    active: z.boolean(),
    startsAt: z.string(),
    endsAt: z.string(),
  })
  .superRefine((values, ctx) => {
    for (const [key, message] of Object.entries(validateBanner(values))) {
      if (message) ctx.addIssue({ code: "custom", path: [key], message });
    }
  });
