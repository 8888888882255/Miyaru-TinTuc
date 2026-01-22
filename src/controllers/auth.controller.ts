import { signJWT } from "@/lib/auth";
import { findOrCreateUser } from "@/services/auth.service";

export async function loginGoogleController(googlePayload: any) {
  const user = await findOrCreateUser(googlePayload);

  const token = signJWT({
    uid: user._id,
    role: user.role,
  });

  return { user, token };
}
