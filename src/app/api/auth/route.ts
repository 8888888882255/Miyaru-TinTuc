import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { loginGoogleController } from "@/controllers/auth.controller";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const { user, token } = await loginGoogleController(body);

  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json(user);
}
