"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

// Interfaces theo core.json và images.json (khớp với PascalCase)
export interface NguoiDung {
  MaNguoiDung: number;
  HoTen: string;
  TenKhongDau: string;
  VaiTro: "super_admin" | "admin";
  TrangThai: "hoat_dong" | "khoa";
  NgayThamGia: string;
  Gmail: string;
  SoTienBaoHiem: number;
}

export interface HinhAnh {
  LoaiHinh: "anh_dai_dien" | "banner";
  ViTri: string;
  DuongDan: string;
  MoTa: string;
  TrangThai: "hien_thi" | "an";
}

export interface HinhAnhNguoiDung {
  MaNguoiDung: number;
  HinhAnh: HinhAnh[];
}

interface HomePageProps {
  nguoiDungData?: NguoiDung[];
  hinhAnhData?: HinhAnhNguoiDung[];
}

export default function HomePage({ nguoiDungData = [], hinhAnhData = [] }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState<NguoiDung[]>([]);
  const [danhSachLoc, setDanhSachLoc] = useState<NguoiDung[]>([]);
  const router = useRouter();

  // Xử lý dữ liệu và lọc người dùng hoạt động
  useEffect(() => {
    if (!nguoiDungData || !Array.isArray(nguoiDungData)) {
      setDanhSachNguoiDung([]);
      setDanhSachLoc([]);
      return;
    }
    const nguoiDungHoatDong = nguoiDungData.filter(
      (user) => user.TrangThai === "hoat_dong"
    );
    setDanhSachNguoiDung(nguoiDungHoatDong);
    setDanhSachLoc(nguoiDungHoatDong);
  }, [nguoiDungData]);

  // Tìm kiếm chỉ theo HoTen
  useEffect(() => {
    const tuKhoa = searchQuery.toLowerCase().trim();
    if (tuKhoa === "") {
      setDanhSachLoc(danhSachNguoiDung);
      return;
    }
    const ketQua = danhSachNguoiDung.filter((user) =>
      user.HoTen.toLowerCase().includes(tuKhoa)
    );
    setDanhSachLoc(ketQua);
  }, [searchQuery, danhSachNguoiDung]);

  // Lấy ảnh đại diện của người dùng
  const layAnhDaiDien = (maNguoiDung: number): string => {
    if (!hinhAnhData || !Array.isArray(hinhAnhData)) {
      return "/default-avatar.jpg";
    }
    const hinhAnhUser = hinhAnhData.find((h) => h.MaNguoiDung === maNguoiDung);
    if (!hinhAnhUser) return "/default-avatar.jpg";
    
    const anhDaiDien = hinhAnhUser.HinhAnh.find(
      (h) => h.LoaiHinh === "anh_dai_dien" && h.TrangThai === "hien_thi"
    );
    return anhDaiDien?.DuongDan || "/default-avatar.jpg";
  };

  const danhSachSuperAdmin = danhSachLoc.filter((u) => u.VaiTro === "super_admin");
  const danhSachAdmin = danhSachLoc.filter((u) => u.VaiTro === "admin");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-all duration-500">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Tối ưu SEO */}
        <section 
          className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
          role="banner"
          aria-label="Giới thiệu cộng đồng Admin MMO"
        >
          <div className="absolute inset-0 opacity-15" aria-hidden="true">
            <img
              src={heroImage.src}
              alt=""
              className="w-full h-full object-cover blur-sm"
              loading="lazy"
            />
          </div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Cộng đồng Admin{" "}
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  MMO
                </span>{" "}
                Việt Nam
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                Tìm kiếm và xác minh các Admin MMO uy tín trước khi giao dịch.
              </p>
              <div className="mt-8 relative max-w-2xl mx-auto">
                <label htmlFor="search-admin" className="sr-only">
                  Tìm kiếm Admin MMO theo tên
                </label>
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500" 
                  aria-hidden="true"
                />
                <Input
                  id="search-admin"
                  type="search"
                  placeholder="Nhập tên Admin để tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-14 text-base rounded-2xl border-2 border-pink-300 focus:border-pink-500 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                  aria-label="Tìm kiếm Admin MMO"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Danh sách Section */}
        <section className="container mx-auto px-4 py-12 space-y-12">
          {/* Danh sách Super Admin MMO */}
          <article 
            className="border border-purple-300 rounded-3xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl"
            aria-labelledby="super-admin-heading"
          >
            <h2 
              id="super-admin-heading"
              className="flex items-center gap-2 font-bold mb-6 text-lg md:text-xl text-purple-700 dark:text-purple-400"
            >
              🧭 Super Admin MMO
            </h2>
            {danhSachSuperAdmin.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-300 italic">
                Không tìm thấy Super Admin nào khớp với từ khóa.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                {danhSachSuperAdmin.map((superAdmin) => (
                  <div
                    key={superAdmin.MaNguoiDung}
                    onClick={() => router.push(`/${superAdmin.TenKhongDau}`)}
                    className="cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-110"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        router.push(`/${superAdmin.TenKhongDau}`);
                      }
                    }}
                    aria-label={`Xem thông tin ${superAdmin.HoTen}`}
                  >
                    <div className="relative group">
                      <img
                        src={layAnhDaiDien(superAdmin.MaNguoiDung)}
                        alt={`Ảnh đại diện ${superAdmin.HoTen}`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-300 group-hover:border-purple-500 transition-all shadow-md"
                        loading="lazy"
                        width="80"
                        height="80"
                      />
                      <span 
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-semibold"
                        aria-label={`Mã số ${superAdmin.MaNguoiDung}`}
                      >
                        {superAdmin.MaNguoiDung}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2 leading-tight">
                      {superAdmin.HoTen}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Danh sách Admin MMO */}
          <article 
            className="border border-pink-300 rounded-3xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl"
            aria-labelledby="admin-heading"
          >
            <h2 
              id="admin-heading"
              className="flex items-center gap-2 font-bold mb-6 text-lg md:text-xl text-pink-700 dark:text-pink-400"
            >
              👥 Admin MMO
            </h2>
            {danhSachAdmin.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-300 italic">
                Không tìm thấy Admin nào khớp với từ khóa.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                {danhSachAdmin.map((admin) => (
                  <div
                    key={admin.MaNguoiDung}
                    onClick={() => router.push(`/${admin.TenKhongDau}`)}
                    className="cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-110"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        router.push(`/${admin.TenKhongDau}`);
                      }
                    }}
                    aria-label={`Xem thông tin ${admin.HoTen}`}
                  >
                    <div className="relative group">
                      <img
                        src={layAnhDaiDien(admin.MaNguoiDung)}
                        alt={`Ảnh đại diện ${admin.HoTen}`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-pink-300 group-hover:border-pink-500 transition-all shadow-md"
                        loading="lazy"
                        width="80"
                        height="80"
                      />
                      <span 
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-semibold"
                        aria-label={`Mã số ${admin.MaNguoiDung}`}
                      >
                        {admin.MaNguoiDung}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2 leading-tight">
                      {admin.HoTen}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}