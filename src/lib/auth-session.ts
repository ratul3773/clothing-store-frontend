import "server-only";
import { headers } from "next/headers";
import { authClient } from "./auth-client";
import { cache } from "react";
import { getSessionCookie } from "better-auth/cookies";

export interface AuthState {
  isAuthenticated: boolean;
  role: string;
  name: string;
  email: string;
  phone: string;
}

const guestSession: AuthState = {
  isAuthenticated: false,
  role: "",
  name: "",
  email: "",
  phone: "",
};

export const getServerSession = cache(async (): Promise<AuthState> => {
  const requestHeaders = new Headers(await headers());
  if (!getSessionCookie(requestHeaders)) return guestSession;

  const controller = new AbortController();
  // Bun's native timeout DOMException has a readonly message. Next's dev
  // error formatter mutates it, so abort with an ordinary Error instead.
  const timeout = setTimeout(() => {
    controller.abort(new Error("Session verification timed out. Please try again."));
  }, 10_000);

  try {
    const { data: session, error } = await authClient.getSession({
      fetchOptions: {
        headers: requestHeaders,
        cache: "no-store",
        signal: controller.signal,
      },
    });
    if (error) throw new Error(error.message || "Unable to verify your session.");
    if (!session?.user) return guestSession;

    return {
      isAuthenticated: true,
      role: session.user.role ?? "",
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone ?? "",
    };
  } finally {
    clearTimeout(timeout);
  }
});
