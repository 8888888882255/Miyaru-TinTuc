"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    roles: ["SuperAdmin", "Moderator", "Reviewer"],
  },
  {
    title: "Danh sách Admin",
    url: "/admin/list",
    icon: Users,
    roles: ["SuperAdmin"],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();

  // TODO: Get from auth context/backend
  const userRole = "SuperAdmin";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const getNavCls = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90"
      : "hover:bg-primary/10";

  return (
    <Sidebar
      className={`border-r transition-all duration-300 ${
        state === "collapsed" ? "w-14" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 bg-[url('/Logo.jpg')] bg-cover bg-center rounded-lg"
          ></div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span
                className="font-semibold text-base bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                AdminMmo
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}