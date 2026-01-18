import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import AdminDetailContent, { User } from "@/components/admin-detail-content";
import { notFound } from "next/navigation";

// Helper để đọc data
async function getUsers(): Promise<User[]> {
  const publicDir = path.join(process.cwd(), "public");
  const fileContents = await fs.readFile(path.join(publicDir, "user.json"), "utf8");
  return JSON.parse(fileContents);
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

  if (!user) {
    return {
      title: "Không tìm thấy - AdminMmo",
    };
  }

  return {
    title: `${user.name} - Thông tin Admin uy tín`,
    description: `Xác minh thông tin của ${user.name}. Quỹ bảo hiểm: ${user.baoHiem?.soTien.toLocaleString("vi-VN")}đ. ${user.dichVu?.join(", ")}`,
    openGraph: {
      title: `${user.name} - AdminMmo Việt Nam`,
      description: `Kiểm tra uy tín của ${user.name}. Quỹ bảo hiểm đảm bảo an toàn giao dịch.`,
      images: [user.avatar],
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
