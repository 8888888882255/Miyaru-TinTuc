import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserRole } from "@/models/enums";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Admin routes - require admin or super_admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(payload.role)) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }

    // API admin routes - require admin or super_admin
    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(payload.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // API user routes - require any authenticated user
    if (req.nextUrl.pathname.startsWith("/api/users")) {
      if (!payload.role) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/users/:path*"],
};
