import { NextRequest, NextResponse } from "next/server";
import { verifyToken, checkRole } from "@/lib/auth";
import {
  createUserController,
  getUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
  searchUsersController,
  filterUsersController,
} from "@/controllers/user.controller";
import { UserRole } from "@/models/enums";

// Middleware to verify authentication and authorization
async function authenticateRequest(request: NextRequest, requiredRole?: UserRole) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return { authenticated: false, error: "No token provided" };
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return { authenticated: false, error: "Invalid token" };
    }

    if (requiredRole && !checkRole(decoded.role, requiredRole)) {
      return { authenticated: false, error: "Insufficient permissions" };
    }

    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, error: "Authentication failed" };
  }
}

// GET - List all users with filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const auth = await authenticateRequest(request, UserRole.ADMIN);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const result = await getUsersController(
      page,
      limit,
      role as UserRole,
      status as any,
      search || undefined
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only SUPER_ADMIN and ADMIN can create users
    const auth = await authenticateRequest(request, UserRole.ADMIN);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const result = await createUserController(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request, UserRole.ADMIN);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const result = await updateUserController(id, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only SUPER_ADMIN can delete users
    const auth = await authenticateRequest(request, UserRole.SUPER_ADMIN);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await deleteUserController(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
