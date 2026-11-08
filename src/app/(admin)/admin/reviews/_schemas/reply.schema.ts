import { z } from "zod";

export const replySchema = z.object({ reply: z.string().trim().min(1, "Reply cannot be empty") });
