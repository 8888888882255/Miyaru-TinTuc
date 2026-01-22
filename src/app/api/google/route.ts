import { NextResponse } from "next/server";
import { loginWithGoogle } from "@/services/auth.service";

export async function POST(req: Request) {
  const { token } = await req.json();

  const data = await loginWithGoogle(token);

  const res = NextResponse.json({ user: data.user });
  res.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  });
  res.cookies.set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
