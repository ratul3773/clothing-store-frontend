import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.BACKEND_URL || "http://localhost:5000",
    plugins: [inferAdditionalFields({
      user: {
        phone: {
          type: "string"
        },
        role:{
          type: "string"
        }
      }
  }),
  emailOTPClient(),
],
})