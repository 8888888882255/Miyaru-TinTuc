import { promises as fs } from "fs";
import path from "path";
import HomePage from "@/components/home-page";
import { User } from "@/types/user";

export default async function Page() {
  // Đọc file users.json từ thư mục public
  const publicDir = path.join(process.cwd(), "public");
  const fileContents = await fs.readFile(path.join(publicDir, "users.json"), "utf8");
  const users: User[] = JSON.parse(fileContents);

  return <HomePage initialUsers={users} />;
}
