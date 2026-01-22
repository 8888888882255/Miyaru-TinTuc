import HomePage from "@/components/home-page";
import { promises as fs } from "fs";
import path from "path";

interface User {
  _id: string;
  fullName: string;
  slug: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "inactive" | "banned";
  trustScore: number;
  avatar?: {
    url: string;
    alt: string;
  };
  contact?: {
    facebookPrimary?: string;
    zalo?: string;
    website?: string;
  };
  insurance?: {
    amount: number;
    currency: string;
  };
  createdAt: string;
}

// Try to get users from API, fallback to local JSON file
async function getUsers(): Promise<User[]> {
  try {
    // First try API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/users?page=1&limit=100`, {
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (apiError) {
    console.log("API fetch failed, using fallback data:", apiError);
  }

  // Fallback: Read from local JSON file
  try {
    const publicDir = path.join(process.cwd(), "public", "DataUser");
    const fileContents = await fs.readFile(
      path.join(publicDir, "core.json"),
      "utf8"
    );
    const localUsers = JSON.parse(fileContents);

    // Transform local data to match User interface
    return localUsers.map((user: any) => ({
      _id: user.id?.toString() || "",
      fullName: user.name || "",
      slug: user.slug || "",
      email: user.email || "",
      role: user.role || "user",
      status: user.status || "active",
      trustScore: user.trustScore || 0,
      avatar: user.avatar
        ? { url: user.avatar, alt: user.name }
        : undefined,
      contact: {
        facebookPrimary: user.facebook?.chinh,
        zalo: user.zalo,
        website: user.web,
      },
      insurance: user.baoHiem
        ? {
            amount: user.baoHiem.soTien,
            currency: "VND",
          }
        : undefined,
      createdAt: user.createdAt || new Date().toISOString(),
    }));
  } catch (fileError) {
    console.error("Failed to read fallback data:", fileError);
    return [];
  }
}

export default async function Page() {
  const users = await getUsers();

  return <HomePage users={users} />;
}