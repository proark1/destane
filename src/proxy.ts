import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/producer",
  "/admin",
  "/analytics",
  "/productions",
  "/settings",
];

export function proxy(request: NextRequest) {
  const session = request.cookies.get("destane_session");
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from auth pages
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/producer/:path*", "/admin/:path*", "/analytics/:path*", "/productions/:path*", "/settings/:path*", "/login", "/register"],
};
