import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.BACKEND_URL || "http://localhost:5000",
    fetchOptions: {
        onError: async (context) => {
            const { response } = context;
            if (response.status === 429) {
                const retryAfter = response.headers.get("X-Retry-After");
                console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
            }
        },
    },
    plugins: [
      inferAdditionalFields({
      user: {
        phone: {
          type: "string"
        },
        role:{
          type: "string",
          input: false
        }
      }
  }),
  emailOTPClient(),
],
})