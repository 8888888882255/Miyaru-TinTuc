"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    zalo?: string;
    website?: string;
  };
  insurance?: {
    amount: number;
    currency: string;
  };
  createdAt: string;
}

interface HomePageProps {
  users?: User[];
}

export default function HomePage({ users = [] }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Filter active users
  useEffect(() => {
    const activeUsers = users.filter((u) => u.status === "active");
    setFilteredUsers(activeUsers);
  }, [users]);

  // Search users
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers(users.filter((u) => u.status === "active"));
      return;
    }

    const results = users.filter(
      (u) =>
        u.status === "active" &&
        (u.fullName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.slug.toLowerCase().includes(query))
    );

    setFilteredUsers(results);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      super_admin: "destructive",
      admin: "warning",
      user: "default",
    };
    const labels: Record<string, string> = {
      super_admin: "Super Admin",
      admin: "Admin",
      user: "User",
    };
    return (
      <Badge variant={variants[role]}>
        {labels[role] || role}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Miyaru TinTuc
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Hệ thống quản lý người dùng chuyên nghiệp với xác minh tức thì
            </p>

            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-12 h-12 rounded-lg border-2 border-blue-300 focus:border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Shield className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Đã đăng ký hệ thống</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {users.filter((u) => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Có thể xác minh</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm tin cậy trung bình</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {users.length > 0
                  ? Math.round(
                      users.reduce((sum, u) => sum + u.trustScore, 0) / users.length
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Trên 100</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Users List Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Danh sách người dùng</h2>

          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  {searchQuery
                    ? "Không tìm thấy người dùng phù hợp"
                    : "Không có người dùng nào"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card
                  key={user._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/${user.slug}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{user.fullName}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                      </div>
                      {user.avatar?.url && (
                        <img
                          src={user.avatar.url}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Vai trò:</span>
                      {getRoleBadge(user.role)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trạng thái:</span>
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
                          ? "Hoạt động"
                          : user.status === "inactive"
                          ? "Không hoạt động"
                          : "Bị cấm"}
                      </Badge>
                    </div>

                    {user.insurance && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bảo hiểm:</span>
                        <span className="text-sm font-medium">
                          {user.insurance.amount.toLocaleString("vi-VN")}{" "}
                          {user.insurance.currency}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-muted-foreground">Điểm tin cậy:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${user.trustScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{user.trustScore}</span>
                      </div>
                    </div>

                    {user.contact?.website && (
                      <div className="pt-3">
                        <a
                          href={user.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Xem trang web →
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Hiển thị {filteredUsers.length} trong {users.length} người dùng
            </div>
          )}
        </div>
      </section>
    </div>
  );
}