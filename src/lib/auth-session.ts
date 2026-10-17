import "server-only";
import { headers } from "next/headers";
import { authClient } from "./auth-client";
import { cache } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  token?: string | null;
  role?: string;
}

export const getServerSession = cache(async () => {
  const {data: session} = await authClient.getSession({
    query:{
      disableCookieCache: true
    },
    fetchOptions: {
      headers: await headers()
    }
  });
  if(!session || !session.user || !session.session.token || session.session.expiresAt < new Date()) {
    return {
      isAuthenticated: false,
      token: null,
    };
  }
  return {
    isAuthenticated: true,
    token: session.session.token,
    role: session.user.role
  };
});