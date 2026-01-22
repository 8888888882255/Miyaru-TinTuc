"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShieldCheck,
  Lock,
  Facebook,
  Globe,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

/* ================= TYPES ================= */

interface FacebookInfo {
  chinh?: string;
  phu?: string | string[];
}

interface BaoHiem {
  ngayDangKy: string;
  soTien: number;
  nguoiBaoHiem: string;
}

interface TaiKhoanPhu {
  nganHang: string;
  soTaiKhoan: string;
}

export interface User {
  id: number;
  name: string;
  username?: string;
  role: string;
  avatar: string;
  status: string;
  soTaiKhoan: string;
  nganHang: string;
  ngayThamGia: string;
  slug: string;
  facebook?: FacebookInfo;
  zalo?: string;
  web?: string;
  baoHiem?: BaoHiem;
  dichVu?: string[];
  chuTaiKhoan?: string;
  stkKhac?: TaiKhoanPhu[];
}

interface AdminDetailContentProps {
  admin: User;
}

/* ================= COMPONENT ================= */

export default function AdminDetailContent({ admin }: AdminDetailContentProps) {
  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy admin
      </div>
    );
  }

  /* ===== CHUẨN HÓA FACEBOOK PHỤ (FIX LỖI MAP) ===== */
  const facebookPhu: string[] = Array.isArray(admin.facebook?.phu)
    ? admin.facebook!.phu
    : admin.facebook?.phu
    ? [admin.facebook.phu]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-pink-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-xl p-8 border backdrop-blur-md">
          {/* AVATAR */}
          <img
            src={admin.avatar}
            alt={admin.name}
            className="w-32 h-32 rounded-full mx-auto border-4 border-pink-400 shadow-lg"
          />

          {/* NAME */}
          <h1 className="text-3xl font-bold mt-4 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {admin.name}
          </h1>

          {admin.username && (
            <p className="text-center text-gray-500 mb-4">
              @{admin.username}
            </p>
          )}

          {/* QUICK ACTION */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {admin.facebook?.chinh && (
              <a
                href={`https://facebook.com/${admin.facebook.chinh}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-blue-600 text-white flex gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
              </a>
            )}

            {admin.zalo && (
              <a
                href={`https://zalo.me/${admin.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-indigo-600 text-white flex gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Zalo
                </Button>
              </a>
            )}
          </div>

          {/* ================= INFO ================= */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* CONTACT */}
            <Card className="p-5 border-2 border-yellow-300">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-yellow-700">
                <ShieldCheck className="w-5 h-5" />
                Thông tin liên hệ
              </h2>

              <ul className="space-y-2 text-sm">
                {/* FACEBOOK CHÍNH + COMBOBOX */}
                {admin.facebook?.chinh && (
                  <li className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook chính:
                    <a
                      href={`https://facebook.com/${admin.facebook.chinh}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {admin.facebook.chinh}
                    </a>

                    {facebookPhu.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="ml-1">
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="w-56">
                          {facebookPhu.map((fb, index) => (
                            <DropdownMenuItem key={index} asChild>
                              <a
                                href={`https://facebook.com/${fb}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Facebook className="w-4 h-4 text-gray-500" />
                                {fb}
                              </a>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </li>
                )}

                {admin.zalo && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    Zalo:
                    <a
                      href={`https://zalo.me/${admin.zalo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {admin.zalo}
                    </a>
                  </li>
                )}

                {admin.web && (
                  <li className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website:
                    <a
                      href={admin.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {admin.web}
                    </a>
                  </li>
                )}
              </ul>
            </Card>

            {/* BAO HIEM */}
            <Card className="p-5 border-2 border-pink-300 bg-pink-50 relative">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-pink-700">
                <Lock className="w-5 h-5" />
                Quỹ Bảo Hiểm AdminMMO
              </h2>

              {admin.baoHiem && (
                <p className="text-sm">
                  Từ ngày{" "}
                  <strong>
                    {new Date(
                      admin.baoHiem.ngayDangKy
                    ).toLocaleDateString("vi-VN")}
                  </strong>
                  , số tiền{" "}
                  <strong className="text-pink-600">
                    {admin.baoHiem.soTien.toLocaleString("vi-VN")}đ
                  </strong>{" "}
                  thuộc{" "}
                  <strong>{admin.baoHiem.nguoiBaoHiem}</strong>
                </p>
              )}
            </Card>
          </div>

          {/* BANK */}
          <Card className="p-5 border-2 border-yellow-300">
            <h2 className="font-semibold mb-2 text-yellow-700">
              Dịch vụ cung cấp:
            </h2>
            <ul className="list-disc list-inside text-sm mb-4">
              {admin.dichVu?.map((dv, i) => (
                <li key={i}>{dv}</li>
              ))}
            </ul>

            <h2 className="font-semibold mb-2 text-yellow-700">
              Chủ tài khoản: {admin.chuTaiKhoan}
            </h2>

            <ul className="text-sm space-y-1">
              <li>
                {admin.nganHang}: <strong>{admin.soTaiKhoan}</strong>
              </li>

              {admin.stkKhac?.map((stk, i) => (
                <li key={i}>
                  {stk.nganHang}: <strong>{stk.soTaiKhoan}</strong>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
