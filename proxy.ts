import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const authPages = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  const token = request.cookies.get("authToken")?.value;

  let isAuthenticated = false;
  let userRole: "ADMIN" | "CONVENER" | "STAFF" | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      isAuthenticated = true;
      userRole = decoded.role;
    } catch {
      isAuthenticated = false;
    }
  }

  const isAuthPage = authPages.includes(pathname);
  const isProtected = pathname !== "/" && !isAuthPage;
  if (!isAuthenticated && isProtected) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (isAuthenticated && isAuthPage) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (pathname === "/" && isAuthenticated) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (isAuthenticated && userRole) {

    if (pathname.startsWith("/master-configuration") && userRole !== "ADMIN") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/reports") && userRole === "STAFF") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/master-configuration/:path*",
    "/meetings/:path*",
    "/reports/:path*",
    "/login",
    "/register",
  ],
};