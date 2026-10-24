import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookie = getSessionCookie(request);
  if(!cookie && (request.nextUrl.pathname.startsWith("/admin/")||request.nextUrl.pathname.startsWith("/account"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if(cookie && (request.nextUrl.pathname.startsWith("/login")||request.nextUrl.pathname.startsWith("/admin-login"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/admin-login/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};