import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import AdminDetailContent from "@/components/admin-detail-content";
import { notFound } from "next/navigation";

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
    facebookSecondary?: string;
    zalo?: string;
    website?: string;
  };
  insurance?: {
    amount: number;
    currency: string;
  };
  details?: Array<{
    title: string;
    content: string;
  }>;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  joinedAt: string;
}

// Fetch users from API with fallback to local JSON
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
    console.log("API fetch failed, using fallback data");
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
        facebookSecondary: user.facebook?.phu,
        zalo: user.zalo,
        website: user.web,
      },
      insurance: user.baoHiem
        ? {
            amount: user.baoHiem.soTien,
            currency: "VND",
          }
        : undefined,
      details: user.stkKhac
        ? user.stkKhac.map((bank: any) => ({
            title: bank.nganHang,
            content: bank.soTaiKhoan,
          }))
        : [],
      seo: {
        title: user.name,
        description: `Thông tin của ${user.name}`,
        keywords: ["admin", "user"],
      },
      createdAt: user.createdAt || new Date().toISOString(),
      joinedAt: user.ngayThamGia || new Date().toISOString(),
    }));
  } catch (fileError) {
    console.error("Failed to read fallback data:", fileError);
    return [];
  }
}

// Generate Static Params để Next.js biết trước các slug
export async function generateStaticParams() {
  const users = await getUsers();
  return users.map((user) => ({
    slug: user.slug,
  }));
}

// Generate Metadata cho SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const users = await getUsers();
  const user = users.find((u) => u.slug === slug);

  if (!user) {
    return {
      title: "Không tìm thấy - Miyaru TinTuc",
    };
  }

  return {
    title: `${user.fullName} - Thông tin người dùng`,
    description: `Xác minh thông tin của ${user.fullName}. Điểm tin cậy: ${user.trustScore}/100. ${
      user.seo?.description || ""
    }`,
    openGraph: {
      title: `${user.fullName} - Miyaru TinTuc`,
      description: `Kiểm tra uy tín của ${user.fullName}. Điểm tin cậy: ${user.trustScore}/100`,
      images: user.avatar?.url ? [user.avatar.url] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const users = await getUsers();
  const user = users.find((u) => u.slug === slug);

  if (!user) {
    notFound();
  }

  return <AdminDetailContent user={user} />;
}
