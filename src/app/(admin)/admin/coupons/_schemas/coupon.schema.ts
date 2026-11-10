import { z } from 'zod';
import { validateCoupon } from '../_utils/coupon.utils';

export const couponFormSchema = (previousCode?: string) => z.object({ code: z.string(), type: z.enum(['pct', 'fix']), value: z.string(), min: z.string(), max: z.string(), note: z.string() }).superRefine((values, ctx) => {
  for (const [key, message] of Object.entries(validateCoupon(values, previousCode))) {
    if (message) ctx.addIssue({ code: 'custom', path: [key], message });
  }
});
