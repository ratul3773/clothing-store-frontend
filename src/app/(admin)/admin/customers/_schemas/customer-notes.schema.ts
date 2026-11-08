import { z } from "zod";

export const customerNotesSchema = z.object({ tag: z.string(), note: z.string() });
