import { NextResponse, type NextRequest } from "next/server";
import { lmsAuthCookieName } from "@/lib/lms-auth";

const publicApiRoutes = new Set([
  "/api/lms/auth/login",
]);

function getRoleDestination(pathname: string) {
  if (pathname.startsWith("/lms/admin") || pathname.startsWith("/api/lms/admin")) {
    return "admin";
  }
  if (pathname.startsWith("/lms/company") || pathname.startsWith("/api/lms/company")) {
    return "company_admin";
  }
  if (pathname.startsWith("/lms/student") || pathname.startsWith("/api/lms/student")) {
    return "student";
  }
  return null;
}

function decodeRoleFromCookie(token: string) {
  try {
    const encoded = token.split(".")[1];
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalized)) as {
      role?: "student" | "admin" | "company_admin";
    };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/lms") && !pathname.startsWith("/api/lms")) {
    return NextResponse.next();
  }

  if (pathname === "/lms" || pathname === "/login" || pathname.startsWith("/api/lms/auth") || publicApiRoutes.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(lmsAuthCookieName)?.value;
  const requiredRole = getRoleDestination(pathname);

  if (!token) {
    if (pathname.startsWith("/api/lms")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!requiredRole) {
    return NextResponse.next();
  }

  const actualRole = decodeRoleFromCookie(token);
  if (!actualRole || actualRole !== requiredRole) {
    if (pathname.startsWith("/api/lms")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const destination =
      actualRole === "admin" ? "/lms/admin" : actualRole === "company_admin" ? "/lms/company" : "/lms/student";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lms/:path*", "/api/lms/:path*", "/login"],
};
