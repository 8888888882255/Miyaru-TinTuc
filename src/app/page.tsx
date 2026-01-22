import { promises as fs } from "fs";
import path from "path";
import HomePage from "@/components/home-page";
import type { NguoiDung, HinhAnhNguoiDung } from "@/components/home-page";

export default async function Page() {
  // Đọc file JSON từ thư mục public/DataUser
  const publicDir = path.join(process.cwd(), "public", "DataUser");
  
  const coreContents = await fs.readFile(
    path.join(publicDir, "core.json"), 
    "utf8"
  );
  const imagesContents = await fs.readFile(
    path.join(publicDir, "images.json"), 
    "utf8"
  );

  const nguoiDungData: NguoiDung[] = JSON.parse(coreContents);
  const hinhAnhData: HinhAnhNguoiDung[] = JSON.parse(imagesContents);

  return (
    <HomePage 
      nguoiDungData={nguoiDungData} 
      hinhAnhData={hinhAnhData} 
    />
  );
}