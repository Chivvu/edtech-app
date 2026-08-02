import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedArea =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin");

  if (!isProtectedArea) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "super-secret-production-nextauth-key-32-chars!";

  const token = await getToken({
    req: request,
    secret,
  });

  const demoCookie = request.cookies.get("eduflow_session");

  // 1. Session Existence Check
  if (!token && !demoCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = (token?.role as string) || "ORG_ADMIN";

  // 2. Admin Middleware Guard (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (userRole !== "ORG_ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard?error=UnauthorizedAdmin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
