import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/admin"];

  const authPaths = ["/login", "/signup"];

  const { pathname } = request.nextUrl;

  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
