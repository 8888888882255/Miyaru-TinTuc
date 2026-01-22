"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { User, getAvatarUrl } from "@/types/user";

interface Settings {
  site: {
    name: string;
    background: {
      url: string;
      alt: string;
    };
  };
}

interface HomePageProps {
  initialUsers: User[];
}

export default function HomePage({ initialUsers }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<Settings | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/settings.json");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Helper function to extract date value
  const getDate = (dateValue: any): Date => {
    if (typeof dateValue === "object" && dateValue?.$date) {
      return new Date(dateValue.$date);
    }
    return new Date(dateValue);
  };

  // Filter active users and sort by createdAt (oldest first) on initial load
  useEffect(() => {
    const activeUsers = initialUsers.filter((u) => u.status === "active");
    const sorted = [...activeUsers].sort((a, b) => {
      return getDate(a.createdAt).getTime() - getDate(b.createdAt).getTime();
    });
    setUsers(sorted);
    setFilteredUsers(sorted);
  }, [initialUsers]);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === "") {
      setFilteredUsers(users);
      return;
    }
    const result = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.slug.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.contact?.website?.toLowerCase().includes(query) ||
        user.contact?.zalo?.toLowerCase().includes(query)
    );
    setFilteredUsers(result);
  }, [searchQuery, users]);

  const superAdminList = filteredUsers.filter((u) => u.role === "super_admin" && u.status === "active");
  const adminList = filteredUsers.filter((u) => u.role === "admin" && u.status === "active");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-all duration-500">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 opacity-15">
            <img
              src={settings?.site.background.url || "/hero-image.jpg"}
              alt={settings?.site.background.alt || "Hero"}
              className="w-full h-full object-cover blur-sm"
            />
          </div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Cộng đồng{" "}
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {settings?.site.name || "AdminMmo"}
                </span>{" "}
                Việt Nam
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                Tìm kiếm và xác minh các {settings?.site.name || "AdminMmo"} uy tín trước khi giao dịch.
              </p>
              <div className="mt-8 relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500" />
                <Input
                  type="text"
                  placeholder="Nhập tên, số tài khoản hoặc zalo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-14 text-base rounded-2xl border-2 border-pink-300 focus:border-pink-500 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 space-y-12">
          <div className="border border-purple-300 rounded-3xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl">
            <h2 className="flex items-center gap-2 font-bold mb-6 text-lg md:text-xl text-purple-700 dark:text-purple-400">
              🧭 Super {settings?.site.name || "AdminMmo"}
            </h2>
            {superAdminList.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-300 italic">
                Không tìm thấy Super Admin nào khớp với từ khóa.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                {superAdminList.map((admin, index) => (
                  <div
                    key={admin._id?.$oid || admin.slug}
                    onClick={() => router.push(`/${admin.slug}`)}
                    className="cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-110"
                  >
                    <div className="relative group">
                      <img
                        src={getAvatarUrl(admin.avatar)}
                        alt={admin.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-300 group-hover:border-purple-500 transition-all shadow-md"
                      />
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2 leading-tight">
                      {admin.fullName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-pink-300 rounded-3xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl">
            <h2 className="flex items-center gap-2 font-bold mb-6 text-lg md:text-xl text-pink-700 dark:text-pink-400">
              👥 {settings?.site.name || "AdminMmo"}
            </h2>
            {adminList.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-300 italic">
                Không tìm thấy Admin nào khớp với từ khóa.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                {adminList.map((admin, index) => (
                  <div
                    key={admin._id?.$oid || admin.slug}
                    onClick={() => router.push(`/${admin.slug}`)}
                    className="cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-110"
                  >
                    <div className="relative group">
                      <img
                        src={getAvatarUrl(admin.avatar)}
                        alt={admin.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-pink-300 group-hover:border-pink-500 transition-all shadow-md"
                      />
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2 leading-tight">
                      {admin.fullName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
