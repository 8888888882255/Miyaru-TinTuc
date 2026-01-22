"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, Facebook, Globe, MessageCircle, CheckCircle2 } from "lucide-react";
import { User, getAvatarUrl, normalizeDate } from "@/types/user";

interface AdminDetailContentProps {
  admin: User;
}

export default function AdminDetailContent({ admin }: AdminDetailContentProps) {
  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <p className="text-lg">Không tìm thấy admin nào.</p>
      </div>
    );
  }

  const joinedDate = normalizeDate(admin.joinedAt);
  const avatarUrl = getAvatarUrl(admin.avatar);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-900 transition-all duration-500">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 text-gray-800 dark:text-gray-200">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl p-8 border border-pink-100 dark:border-gray-700 backdrop-blur-md">
          <img
            src={avatarUrl}
            alt={admin.fullName}
            className="w-32 h-32 rounded-full mx-auto border-4 border-pink-400 dark:border-pink-500 shadow-lg"
          />
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-center flex items-center justify-center gap-2">
            {admin.fullName}
            {admin.emailVerified && (
              <CheckCircle2 className="w-7 h-7 text-pink-500" />
            )}
          </h1>
          
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {admin.contact?.facebookPrimary && (
              <a
                href={`https://facebook.com/${admin.contact.facebookPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  <Facebook className="w-4 h-4" /> Check Facebook
                </Button>
              </a>
            )}
            {admin.contact?.zalo && (
              <a
                href={`https://zalo.me/${admin.contact.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Check Zalo
                </Button>
              </a>
            )}
          </div>

          {admin.role !== "user" && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-5 border-2 border-yellow-300 dark:border-yellow-500 bg-white/80 dark:bg-gray-800/60">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <ShieldCheck className="w-5 h-5" /> Thông tin liên hệ
                </h2>
                <ul className="space-y-2 text-sm">
                  {admin.contact?.facebookPrimary && (
                    <li className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Facebook chính: 
                      <a
                        href={`https://facebook.com/${admin.contact.facebookPrimary}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {admin.contact.facebookPrimary}
                      </a>
                    </li>
                  )}
                  {admin.contact?.facebookSecondary && (
                    <li className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                       Facebook phụ: 
                      <a
                        href={`https://facebook.com/${admin.contact.facebookSecondary}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                       {admin.contact.facebookSecondary}
                      </a>
                    </li>
                  )}
                  {admin.contact?.zalo && (
                    <li className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      Zalo/SĐT: 
                      <a
                        href={`https://zalo.me/${admin.contact.zalo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {admin.contact.zalo}
                      </a>
                    </li>
                  )}
                  {admin.contact?.website && (
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      Website: 
                      <a
                        href={admin.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {admin.contact.website}
                      </a>
                    </li>
                  )}
                </ul>
              </Card>

              <Card className="p-5 border-2 border-pink-300 dark:border-pink-500 bg-pink-50/70 dark:bg-gray-800/60 relative">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-pink-700 dark:text-pink-400">
                  <Lock className="w-5 h-5" /> Quỹ Bảo Hiểm AdminMmo
                </h2>
                <div className="space-y-3">
                  {admin.trustScore && (
                    <div className="flex items-center gap-2 pb-3 border-b border-pink-200 dark:border-pink-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-semibold">Điểm tin cậy:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{admin.trustScore}/100</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">
                    Từ ngày{" "}
                    <span className="font-semibold text-pink-600 dark:text-pink-400">
                      {joinedDate ? new Date(joinedDate).toLocaleDateString("vi-VN") : "N/A"}
                    </span>
                    , hệ thống đảm bảo an toàn với số tiền{" "}
                    <span className="font-bold text-pink-600 dark:text-pink-400">
                      {admin.insurance?.amount.toLocaleString("vi-VN")} {admin.insurance?.currency}
                    </span>
                    .
                  </p>
                </div>
                <Lock className="absolute right-4 bottom-4 w-12 h-12 text-pink-400 opacity-50" />
              </Card>
            </div>
          )}

          <Card className="p-5 border-2 border-yellow-300 dark:border-yellow-500 bg-white/80 dark:bg-gray-800/60">
            <div className="space-y-4">
              {admin.details && admin.details.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-400">
                    Thông tin chi tiết:
                  </h2>
                  <ul className="text-sm space-y-1">
                    {admin.details.map((detail, index) => (
                      <li key={index}>
                        <strong>{detail.title}:</strong> {detail.content}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {admin.seo && (
                <div>
                  <h2 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-400">
                    Thông tin khác:
                  </h2>
                  <div className="space-y-2 text-sm">
                    {admin.email && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Mail:</strong> <a href={`mailto:${admin.email}`} className="text-blue-600 hover:underline">{admin.email}</a>
                      </p>
                    )}
                    <p className="text-gray-700 dark:text-gray-300">{admin.seo.description}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
