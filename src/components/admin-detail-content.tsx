"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Facebook,
  Globe,
  MessageCircle,
  Mail,
  Calendar,
  TrendingUp,
} from "lucide-react";

/* ================= TYPES ================= */

export interface User {
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

interface AdminDetailContentProps {
  user: User;
}

/* ================= COMPONENT ================= */

export default function AdminDetailContent({ user }: AdminDetailContentProps) {
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Không tìm thấy người dùng</p>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-8 border backdrop-blur-md mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              {user.avatar?.url && (
                <img
                  src={user.avatar.url}
                  alt={user.fullName}
                  className="w-40 h-40 rounded-full border-4 border-blue-400 shadow-lg flex-shrink-0"
                />
              )}

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {user.fullName}
                </h1>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  <Badge
                    variant={
                      user.role === "super_admin"
                        ? "destructive"
                        : user.role === "admin"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.role === "super_admin"
                      ? "Super Admin"
                      : user.role === "admin"
                      ? "Admin"
                      : "User"}
                  </Badge>
                  <Badge
                    variant={
                      user.status === "active"
                        ? "default"
                        : user.status === "inactive"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {user.status === "active"
                      ? "Đang hoạt động"
                      : user.status === "inactive"
                      ? "Không hoạt động"
                      : "Bị cấm"}
                  </Badge>
                </div>

                {/* Trust Score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Điểm tin cậy</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{ width: `${user.trustScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {user.trustScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 flex-wrap">
              {user.contact?.facebookPrimary && (
                <a
                  href={user.contact.facebookPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-blue-600 text-white flex gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                </a>
              )}

              {user.contact?.zalo && (
                <a
                  href={`https://zalo.me/${user.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-indigo-600 text-white flex gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Zalo
                  </Button>
                </a>
              )}

              {user.contact?.website && (
                <a
                  href={user.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-600 text-white flex gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Contact Information */}
            <Card className="p-6 border-2 border-blue-300">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
                <Mail className="w-5 h-5" />
                Thông tin liên hệ
              </h2>

              <ul className="space-y-3 text-sm">
                <li>
                  <span className="text-gray-600">Email:</span>
                  <p className="text-blue-600 break-all">{user.email}</p>
                </li>

                {user.contact?.facebookPrimary && (
                  <li>
                    <span className="text-gray-600 flex items-center gap-2 mb-1">
                      <Facebook className="w-4 h-4" />
                      Facebook chính
                    </span>
                    <a
                      href={user.contact.facebookPrimary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {user.contact.facebookPrimary}
                    </a>
                  </li>
                )}

                {user.contact?.facebookSecondary && (
                  <li>
                    <span className="text-gray-600 flex items-center gap-2 mb-1">
                      <Facebook className="w-4 h-4" />
                      Facebook phụ
                    </span>
                    <a
                      href={user.contact.facebookSecondary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {user.contact.facebookSecondary}
                    </a>
                  </li>
                )}

                {user.contact?.zalo && (
                  <li>
                    <span className="text-gray-600 flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      Zalo
                    </span>
                    <p className="text-blue-600">{user.contact.zalo}</p>
                  </li>
                )}

                {user.contact?.website && (
                  <li>
                    <span className="text-gray-600 flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4" />
                      Website
                    </span>
                    <a
                      href={user.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {user.contact.website}
                    </a>
                  </li>
                )}
              </ul>
            </Card>

            {/* Insurance & Details */}
            <Card className="p-6 border-2 border-amber-300">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-700">
                <ShieldCheck className="w-5 h-5" />
                Bảo hiểm & Hạn mức
              </h2>

              <ul className="space-y-3 text-sm">
                {user.insurance && (
                  <>
                    <li>
                      <span className="text-gray-600">Quỹ bảo hiểm:</span>
                      <p className="text-lg font-bold text-green-600">
                        {user.insurance.amount.toLocaleString("vi-VN")}{" "}
                        {user.insurance.currency}
                      </p>
                    </li>
                  </>
                )}

                {user.details && user.details.length > 0 && (
                  <>
                    <li className="border-t pt-3">
                      <span className="text-gray-600 font-medium block mb-2">
                        Tài khoản ngân hàng:
                      </span>
                      {user.details.map((detail, idx) => (
                        <div key={idx} className="mb-2 bg-gray-50 p-2 rounded">
                          <p className="font-medium">{detail.title}</p>
                          <p className="text-gray-700 font-mono text-sm">
                            {detail.content}
                          </p>
                        </div>
                      ))}
                    </li>
                  </>
                )}
              </ul>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="p-6 border-2 border-indigo-300 mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-700">
              <Calendar className="w-5 h-5" />
              Lịch sử hoạt động
            </h2>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-gray-600">Tham gia:</span>
                  <p className="font-medium">{formatDate(user.joinedAt)}</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-gray-600">Tạo tài khoản:</span>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </li>
            </ul>
          </Card>

          {/* SEO Section */}
          {user.seo && (
            <Card className="p-6 border-2 border-purple-300 mb-6">
              <h2 className="font-bold text-lg mb-4 text-purple-700">
                Thông tin SEO
              </h2>

              <ul className="space-y-3 text-sm">
                <li>
                  <span className="text-gray-600 block mb-1">Tiêu đề:</span>
                  <p className="text-gray-800">{user.seo.title}</p>
                </li>

                <li>
                  <span className="text-gray-600 block mb-1">Mô tả:</span>
                  <p className="text-gray-800">{user.seo.description}</p>
                </li>

                {user.seo.keywords && user.seo.keywords.length > 0 && (
                  <li>
                    <span className="text-gray-600 block mb-1">Từ khóa:</span>
                    <div className="flex gap-2 flex-wrap">
                      {user.seo.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
