import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import AdminDetailContent from "@/components/admin-detail-content";
import { notFound } from "next/navigation";
import { User, normalizeDate, getAvatarUrl } from "@/types/user";

// Helper để đọc data
async function getUsers(): Promise<User[]> {
  const publicDir = path.join(process.cwd(), "public");
  const fileContents = await fs.readFile(path.join(publicDir, "users.json"), "utf8");
  return JSON.parse(fileContents);
}

// Helper để đọc settings
async function getSettings() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const fileContents = await fs.readFile(path.join(publicDir, "settings.json"), "utf8");
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}

// Generate Static Params để Next.js biết trước các slug nếu build static
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
  const settings = await getSettings();
  const siteName = settings?.site.name || "AdminMmo";

  if (!user) {
    return {
      title: `Không tìm thấy - ${siteName}`,
    };
  }

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
  const users = await getUsers();
  const user = users.find((u) => u.slug === slug);

  if (!user) {
    notFound();
  }

  return <AdminDetailContent admin={user} />;
}
