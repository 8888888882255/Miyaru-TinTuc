import { verifyGoogleToken } from "@/lib/google";
import { UserModel } from "@/models/user.model";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";

export async function loginWithGoogle(idToken: string) {
  const payload = await verifyGoogleToken(idToken);
  await connectDB();

  let user = await UserModel.findOne({
    "auth.provider": "google",
    "auth.providerAccountId": payload.sub,
  });

  if (!user) {
    user = await UserModel.create({
      fullName: payload.name,
      slug: payload.email?.split("@")[0],
      email: payload.email,
      emailVerified: payload.email_verified,
      avatar: {
        url: payload.picture,
        alt: payload.name,
      },
      auth: {
        provider: "google",
        providerAccountId: payload.sub,
      },
      joinedAt: new Date(),
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user,
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}
