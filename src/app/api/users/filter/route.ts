import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { filterUsersController } from "@/controllers/user.controller";

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

// POST /api/users/filter
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { filters, page = 1, limit = 10 } = body;

    const result = await filterUsersController(filters, page, limit);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
