import { cookies } from "next/headers";

export function setSession(token: string) {
  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
}
