"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User, getAvatarUrl, normalizeDate } from "@/types/user";

export default function AdminList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states for multi-input fields
  const [detailInputs, setDetailInputs] = useState<{ title: string; content: string }[]>([{ title: "", content: "" }]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/users.json");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const mappedUsers = data.map((u: any, index: number) => ({
          ...u,
          id: u._id?.$oid || (index + 1).toString(),
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách quản trị viên.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setDetailInputs(editingUser.details && editingUser.details.length > 0 ? [...editingUser.details] : [{ title: "", content: "" }]);
    } else {
      setDetailInputs([{ title: "", content: "" }]);
    }
  }, [editingUser]);

  const filteredUsers = useCallback(() => {
    return users.filter((user) => {
      const matchesSearch = JSON.stringify(user).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter])();

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleOpenForm = (user?: User) => {
    setEditingUser(user || null);
    setIsFormOpen(true);
  };

  const addDetailInput = () => {
    setDetailInputs((prev) => [...prev, { title: "", content: "" }]);
  };

  const removeDetailInput = (index: number) => {
    setDetailInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDetailInput = (index: number, field: "title" | "content", value: string) => {
    setDetailInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = { ...newInputs[index], [field]: value };
      return newInputs;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const slug = (formData.get("slug") as string) || fullName.toLowerCase().replace(/\s+/g, "-");
    const facebookSecondary = formData.get("facebookSecondary") as string;
    const zalo = formData.get("zalo") as string;
    const website = formData.get("website") as string;
    const trustScore = parseInt(formData.get("trustScore") as string, 10) || 50;

    const newUser: User = {
      _id: editingUser?._id,
      fullName,
      slug,
      email: formData.get("email") as string,
      emailVerified: false,
      role: formData.get("role") as "admin" | "super_admin" | "user",
      trustScore,
      avatar: {
        url: formData.get("avatarUrl") as string,
        alt: fullName,
      },
      status: formData.get("status") as "active" | "inactive",
      joinedAt: formData.get("joinedAt") as string,
      contact: {
        facebookPrimary: formData.get("facebookPrimary") as string,
        facebookSecondary: facebookSecondary ? facebookSecondary : undefined,
        zalo: zalo ? zalo : undefined,
        website: website ? website : undefined,
      },
      insurance: {
        amount: parseInt(formData.get("insuranceAmount") as string, 10) || 0,
        currency: "VND",
      },
      details: detailInputs.filter((d) => d.title.trim() && d.content.trim()),
      seo: {
        title: formData.get("seoTitle") as string,
        description: formData.get("seoDescription") as string,
        keywords: (formData.get("seoKeywords") as string).split(",").map(k => k.trim()),
      },
    };

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.slug === editingUser.slug ? newUser : u))
      );
      toast({
        title: "Đã cập nhật quản trị viên",
        description: `${fullName} đã được cập nhật.`,
      });
    } else {
      setUsers((prev) => [...prev, newUser]);
      toast({
        title: "Đã thêm quản trị viên",
        description: `${fullName} đã được thêm vào hệ thống.`,
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((u) => u.slug !== selectedUser.slug));
      toast({
        title: "Đã xóa quản trị viên",
        description: `${selectedUser.fullName} đã được xóa khỏi hệ thống.`,
      });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "super_admin":
        return "secondary";
      case "user":
        return "default";
      default:
        return "outline";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const joinedDate = editingUser ? normalizeDate(editingUser.joinedAt) : new Date().toISOString().split('T')[0];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">👨‍💻 Danh sách Admin</h1>
            </div>
            <Button onClick={() => handleOpenForm()} className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm Admin
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Lọc theo quyền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quyền</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:block rounded-lg border bg-card shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Quyền</TableHead>
                  <TableHead>Tin cậy</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => {
                  const joinDate = normalizeDate(user.joinedAt);
                  return (
                    <TableRow
                      key={user.slug}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={getAvatarUrl(user.avatar)} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{user.trustScore || 0}/100</span>
                      </TableCell>
                      <TableCell>
                        {joinDate ? new Date(joinDate).toLocaleDateString("vi-VN") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : "destructive"}
                        >
                          {user.status === "active" ? "🟢 Hoạt động" : "🔴 Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenForm(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {currentUsers.map((user) => {
              const joinDate = normalizeDate(user.joinedAt);
              return (
                <div
                  key={user.slug}
                  className="rounded-lg border bg-card p-4 shadow-soft space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={getAvatarUrl(user.avatar)} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.fullName}</h3>
                      </div>
                    </div>
                    <Badge
                      variant={user.status === "active" ? "default" : "destructive"}
                    >
                      {user.status === "active" ? "🟢" : "🔴"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Tin cậy: {user.trustScore || 0}%
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {joinDate ? new Date(joinDate).toLocaleDateString("vi-VN") : "N/A"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenForm(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Không tìm thấy quản trị viên nào.
              </p>
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="flex justify-center gap-2 pt-4 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Trước
              </Button>
              {pageNumbers.map((number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === pageNumbers.length}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Chỉnh sửa Quản trị viên" : "Thêm Quản trị viên"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                  Tên đầy đủ
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={editingUser?.fullName || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editingUser?.slug || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingUser?.email || ""}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  Quyền hạn
                </label>
                <Select
                  name="role"
                  defaultValue={editingUser?.role || "admin"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quyền hạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="trustScore" className="block text-sm font-medium mb-1">
                  Điểm tin cậy (0-100)
                </label>
                <Input
                  id="trustScore"
                  name="trustScore"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={editingUser?.trustScore || 50}
                />
              </div>
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  defaultValue={typeof editingUser?.avatar === 'string' ? editingUser.avatar : editingUser?.avatar?.url || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Trạng thái
                </label>
                <Select
                  name="status"
                  defaultValue={editingUser?.status || "active"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="joinedAt" className="block text-sm font-medium mb-1">
                  Ngày tham gia
                </label>
                <Input
                  id="joinedAt"
                  name="joinedAt"
                  type="date"
                  defaultValue={joinedDate}
                  required
                />
              </div>
              <div>
                <label htmlFor="facebookPrimary" className="block text-sm font-medium mb-1">
                  Facebook chính
                </label>
                <Input
                  id="facebookPrimary"
                  name="facebookPrimary"
                  defaultValue={editingUser?.contact?.facebookPrimary || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="facebookSecondary" className="block text-sm font-medium mb-1">
                  Facebook phụ (tùy chọn)
                </label>
                <Input
                  id="facebookSecondary"
                  name="facebookSecondary"
                  defaultValue={editingUser?.contact?.facebookSecondary || ""}
                />
              </div>
              <div>
                <label htmlFor="zalo" className="block text-sm font-medium mb-1">
                  Zalo/SĐT (tùy chọn)
                </label>
                <Input
                  id="zalo"
                  name="zalo"
                  defaultValue={editingUser?.contact?.zalo || ""}
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-1">
                  Website (tùy chọn)
                </label>
                <Input
                  id="website"
                  name="website"
                  defaultValue={editingUser?.contact?.website || ""}
                />
              </div>
              <div>
                <label htmlFor="insuranceAmount" className="block text-sm font-medium mb-1">
                  Số tiền bảo hiểm
                </label>
                <Input
                  id="insuranceAmount"
                  name="insuranceAmount"
                  type="number"
                  defaultValue={editingUser?.insurance?.amount || 0}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Thông tin chi tiết (tài khoản)
                </label>
                {detailInputs.map((detail, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={detail.title}
                      onChange={(e) => updateDetailInput(index, "title", e.target.value)}
                      placeholder={`Tiêu đề ${index + 1}`}
                    />
                    <Input
                      value={detail.content}
                      onChange={(e) => updateDetailInput(index, "content", e.target.value)}
                      placeholder={`Nội dung ${index + 1}`}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => addDetailInput()}
                      disabled={index !== detailInputs.length - 1}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeDetailInput(index)}
                      disabled={detailInputs.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="seoTitle" className="block text-sm font-medium mb-1">
                  Tiêu đề SEO
                </label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  defaultValue={editingUser?.seo?.title || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium mb-1">
                  Mô tả SEO
                </label>
                <Input
                  id="seoDescription"
                  name="seoDescription"
                  defaultValue={editingUser?.seo?.description || ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="seoKeywords" className="block text-sm font-medium mb-1">
                  Từ khóa SEO (cách nhau bằng dấu phẩy)
                </label>
                <Input
                  id="seoKeywords"
                  name="seoKeywords"
                  defaultValue={editingUser?.seo?.keywords?.join(", ") || ""}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Lưu
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa quản trị viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedUser?.fullName}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
