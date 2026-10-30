import "server-only";
import { headers } from "next/headers";
import { authClient } from "./auth-client";
import { cache } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  role: string;
  name: string;
  email: string;
  phone: string;
}

export const getServerSession = cache(async () => {
  const {data: session,error} = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      signal: AbortSignal.timeout(5000),
    }
  });
  if(error) {
    console.error("Error fetching session:", error);
  }
  if(!session || !session.user) {
    return {
      isAuthenticated: false,
      role: "",
      name: "",
      email: "",
      phone: ""
    };
  }
  return {
    isAuthenticated: true,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    phone: session.user.phone
  };
});