"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Settings {
  site: {
    name: string;
    logo: {
      url: string;
      alt: string;
    };
  };
}

export const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + tên thương hiệu */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={settings?.site.logo.url || "/Logo.jpg"}
              alt={settings?.site.logo.alt || "Logo AdminMmo"}
              className="w-12 h-12 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              {settings?.site.name || "AdminMmo"}
            </span>
          </Link>

          {/* Menu + Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="hero"
                size="default"
                onClick={() => router.push("/")}
                className="whitespace-nowrap font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all"
              >
                🚨 Danh Sách {settings?.site.name || "AdminMmo"}
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => router.push("/policy")}
                className="whitespace-nowrap border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Chính Sách
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => router.push("/about")}
                className="whitespace-nowrap border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                Giới Thiệu
              </Button>
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
            </Button>

            {/* User menu toggle */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <User className="w-5 h-5 text-purple-500" />
              </Button>

              {/* User menu dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-fade-in">
                  <div className="p-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/login");
                        setUserMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mt-3 flex justify-center md:hidden animate-fade-in">
            <div className="w-[90%] max-w-[340px] flex flex-col gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl bg-white dark:bg-gray-900/90 backdrop-blur-md">
              <Button
                variant="hero"
                size="default"
                onClick={() => {
                  router.push("/");
                  setMenuOpen(false);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90"
              >
                🚨 Danh Sách Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/policy");
                  setMenuOpen(false);
                }}
                className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Chính Sách
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/about");
                  setMenuOpen(false);
                }}
                className="border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                Giới Thiệu
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

