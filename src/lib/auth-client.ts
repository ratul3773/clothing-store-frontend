import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
  fetchOptions: {
    credentials: "include",
    onError: async ({ response }) => {
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        console.warn(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        phone: { type: "string" },
        role: { type: "string", input: false },
      },
    }),
    emailOTPClient(),
  ],
});