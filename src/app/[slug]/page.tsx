import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import AdminDetailContent from "@/components/admin-detail-content";
import { notFound } from "next/navigation";
import { User as UserType, getAvatarUrl } from "@/types/user";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Helper để đọc settings (giữ nguyên vì settings.json có thể vẫn là file config tĩnh)
async function getSettings() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(path.join(publicDir, "settings.json"), "utf8");
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}

// Generate Static Params
export async function generateStaticParams() {
  await dbConnect();
  // Only fetch slugs for static params
  const users = await User.find({}, { slug: 1 }).lean();
  
  return users.map((user: unknown) => ({
    // @ts-ignore
    slug: (user as { slug: string }).slug,
  }));
}

// Generate Metadata cho SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  await dbConnect();
  const user = await User.findOne({ slug }).lean() as unknown as UserType;
  const settings = await getSettings();
  const siteName = settings?.site.name || "AdminMmo";

  if (!user) {
    return {
      title: `Không tìm thấy - ${siteName}`,
    };
  }

  // Need to handle avatar properly since it might be legacy string or object
  // But getAvatarUrl helper handles both.
  const avatarUrl = getAvatarUrl(user.avatar);
  const description = user.seo?.description || `Xác minh thông tin của ${user.fullName}. Quỹ bảo hiểm: ${user.insurance?.amount.toLocaleString("vi-VN")}đ.`;

  return {
    title: `${user.fullName} - Thông tin Admin uy tín`,
    description: description,
    openGraph: {
      title: `${user.fullName} - ${siteName} Việt Nam`,
      description: description,
      images: [avatarUrl],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await dbConnect();
  const user = await User.findOne({ slug }).lean();

  if (!user) {
    notFound();
  }

  // Serialize and normalize ID
  const serializedUser: UserType = JSON.parse(JSON.stringify(user));
  // @ts-ignore
  serializedUser.id = serializedUser._id;

  return <AdminDetailContent admin={serializedUser} />;
}
