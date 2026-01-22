import jwt from "jsonwebtoken";

export function signJWT(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
