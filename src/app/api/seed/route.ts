import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import fs from "fs";
import path from "path";

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
     // Optional: Protect this route in production
     // return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    await dbConnect();

    const filePath = path.join(process.cwd(), "public", "users.json");
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "users.json not found" }, { status: 404 });
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const users: unknown[] = JSON.parse(fileContent);

    let count = 0;
    // @ts-ignore
    for (const u of users) {
      // Normalize _id
      // @ts-ignore
      const userId = u._id?.$oid || u._id;
      
      // Normalize dates
      // @ts-ignore
      const joinedAt = u.joinedAt?.$date || u.joinedAt;
      // @ts-ignore
      const lastLoginAt = u.lastLoginAt?.$date || u.lastLoginAt;
      // @ts-ignore
      const createdAt = u.createdAt?.$date || u.createdAt;
      // @ts-ignore
      const updatedAt = u.updatedAt?.$date || u.updatedAt;

      // Prepare object for Mongoose
      const userObj = {
        ...(u as any),
        _id: userId,
        joinedAt,
        lastLoginAt,
        createdAt,
        updatedAt
      };
      
      // Remove legacy structure to prevent overwrite with object if schema expects date/string
      // Although strict: false handles it, it's cleaner to clean it up.

      await User.findByIdAndUpdate(userId, userObj, { upsert: true, new: true, strict: false });
      count++;
    }

    return NextResponse.json({ message: `Seeded ${count} users successfully` });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Seed failed", details: errorMessage }, { status: 500 });
  }
}
