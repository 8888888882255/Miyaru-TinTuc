"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Users, TrendingUp, Shield } from "lucide-react";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "inactive" | "banned";
  trustScore: number;
  createdAt: string;
  lastLoginAt?: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  avgTrustScore: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Vui lòng đăng nhập");
          setLoading(false);
          return;
        }

        // Fetch users list
        const response = await fetch("/api/users?page=1&limit=100", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const data = await response.json();
        const usersList: User[] = data.data || [];
        setUsers(usersList);

        // Calculate statistics
        const total = usersList.length;
        const active = usersList.filter((u) => u.status === "active").length;
        const inactive = usersList.filter((u) => u.status === "inactive").length;
        const banned = usersList.filter((u) => u.status === "banned").length;
        const avgTrust =
          usersList.length > 0
            ? Math.round(
                usersList.reduce((sum, u) => sum + u.trustScore, 0) /
                  usersList.length
              )
            : 0;

        setStats({
          totalUsers: total,
          activeUsers: active,
          inactiveUsers: inactive,
          bannedUsers: banned,
          avgTrustScore: avgTrust,
        });

        // Prepare chart data (by status)
        const statusCounts = {
          "Đang hoạt động": active,
          "Không hoạt động": inactive,
          "Bị cấm": banned,
        };

        setChartData(
          Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value,
          }))
        );

        // Prepare role data
        const roleCounts = {
          "Người dùng": usersList.filter((u) => u.role === "user").length,
          "Quản trị viên": usersList.filter((u) => u.role === "admin").length,
          "Super Admin": usersList.filter((u) => u.role === "super_admin")
            .length,
        };

        setRoleData(
          Object.entries(roleCounts).map(([name, value]) => ({
            name,
            value,
          }))
        );
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      super_admin: "destructive",
      admin: "warning",
      user: "default",
    };
    return variants[role] || "default";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: "default",
      inactive: "secondary",
      banned: "destructive",
    };
    const labels: Record<string, string> = {
      active: "Đang hoạt động",
      inactive: "Không hoạt động",
      banned: "Bị cấm",
    };
    return (
      <Badge variant={variants[status]}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[60px]" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Tất cả người dùng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.activeUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalUsers ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Không hoạt động</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.inactiveUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalUsers ? ((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bị cấm</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats?.bannedUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalUsers ? ((stats.bannedUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm tin cậy</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.avgTrustScore || 0}
              </div>
              <p className="text-xs text-muted-foreground">Trung bình</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo vai trò</CardTitle>
            </CardHeader>
            <CardContent>
              {roleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Người dùng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Tên</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Vai trò</th>
                    <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium">Điểm tin cậy</th>
                    <th className="text-left py-3 px-4 font-medium">Ngày tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.fullName}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getRoleBadge(user.role)}>
                          {user.role === "super_admin"
                            ? "Super Admin"
                            : user.role === "admin"
                            ? "Admin"
                            : "User"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${user.trustScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{user.trustScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
