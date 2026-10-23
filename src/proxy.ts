import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookie = getSessionCookie(request);
  if(!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
  ],
};