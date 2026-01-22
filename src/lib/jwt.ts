import jwt from "jsonwebtoken";
import { IUser } from "@/models/user.model";

export function signAccessToken(user: IUser) {
  return jwt.sign(
    { uid: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
}

export function signRefreshToken(user: IUser) {
  return jwt.sign(
    { uid: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "30d" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
