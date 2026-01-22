import { NextRequest, NextResponse } from "next/server";
import { verifyToken, checkRole } from "@/lib/auth";
import {
  searchUsersController,
  filterUsersController,
} from "@/controllers/user.controller";
import { UserRole } from "@/models/enums";

async function authenticateRequest(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return { authenticated: false, error: "No token provided" };
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return { authenticated: false, error: "Invalid token" };
    }

    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, error: "Authentication failed" };
  }
}

// GET /api/users/search?q=...
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!q) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const result = await searchUsersController(q, page, limit);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
