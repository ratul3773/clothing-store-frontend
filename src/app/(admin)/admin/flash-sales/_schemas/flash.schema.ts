import { z } from 'zod';
import { validateFlash } from '../_utils/flash.utils';

export const flashFormSchema = z.object({ title: z.string(), subtitle: z.string(), discountPct: z.string(), enabled: z.boolean(), startsAt: z.string(), endsAt: z.string(), productIds: z.array(z.string()) }).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateFlash(values))) {
    if (message) ctx.addIssue({ code: 'custom', path: [key], message });
  }
});
