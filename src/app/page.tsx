import { promises as fs } from "fs";
import path from "path";
import HomePage, { User } from "@/components/home-page";

export default async function Page() {
  // Đọc file user.json từ thư mục public
  const publicDir = path.join(process.cwd(), "public");
  const fileContents = await fs.readFile(path.join(publicDir, "user.json"), "utf8");
  const users: User[] = JSON.parse(fileContents);

  return <HomePage initialUsers={users} />;
}
