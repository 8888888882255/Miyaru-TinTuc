"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserRole, UserStatus } from "@/models/enums";

interface UserFormData {
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  trustScore: number;
  avatar: {
    url: string;
    alt: string;
  };
  contact: {
    facebookPrimary?: string;
    facebookSecondary?: string;
    zalo?: string;
    website?: string;
  };
  insurance: {
    amount: number;
    currency: string;
  };
  details: {
    title: string;
    content: string;
  }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  title: string;
}

export function UserModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
  title,
}: UserModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      fullName: "",
      email: "",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      trustScore: 0,
      avatar: { url: "", alt: "" },
      contact: {},
      insurance: { amount: 0, currency: "VND" },
      details: [],
      seo: { title: "", description: "", keywords: [] },
    }
  );

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleNestedChange = useCallback(
    (parent: string, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [field]: value,
        },
      }));
    },
    []
  );

  const handleAddDetail = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { title: "", content: "" }],
    }));
  }, []);

  const handleRemoveDetail = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: `User ${initialData ? "updated" : "created"} successfully`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update user information" : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(v) => handleInputChange("role", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={UserStatus.BANNED}>Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Trust Score (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.trustScore}
                onChange={(e) => handleInputChange("trustScore", parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Avatar</h3>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input
                value={formData.avatar.url}
                onChange={(e) => handleNestedChange("avatar", "url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Avatar Alt Text</Label>
              <Input
                value={formData.avatar.alt}
                onChange={(e) => handleNestedChange("avatar", "alt", e.target.value)}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <Label>Facebook Primary</Label>
              <Input
                value={formData.contact.facebookPrimary || ""}
                onChange={(e) => handleNestedChange("contact", "facebookPrimary", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook Secondary</Label>
              <Input
                value={formData.contact.facebookSecondary || ""}
                onChange={(e) => handleNestedChange("contact", "facebookSecondary", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zalo</Label>
              <Input
                value={formData.contact.zalo || ""}
                onChange={(e) => handleNestedChange("contact", "zalo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.contact.website || ""}
                onChange={(e) => handleNestedChange("contact", "website", e.target.value)}
              />
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Insurance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={formData.insurance.amount}
                  onChange={(e) => handleNestedChange("insurance", "amount", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select
                  value={formData.insurance.currency}
                  onValueChange={(v) => handleNestedChange("insurance", "currency", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Bank Details</h3>
              <Button type="button" onClick={handleAddDetail} size="sm" variant="outline">
                Add Detail
              </Button>
            </div>
            {formData.details.map((detail, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-3 border rounded">
                <Input
                  placeholder="Title (e.g., MB Bank)"
                  value={detail.title}
                  onChange={(e) => {
                    const newDetails = [...formData.details];
                    newDetails[index].title = e.target.value;
                    handleInputChange("details", newDetails);
                  }}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Content (e.g., account number)"
                    value={detail.content}
                    onChange={(e) => {
                      const newDetails = [...formData.details];
                      newDetails[index].content = e.target.value;
                      handleInputChange("details", newDetails);
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveDetail(index)}
                    size="sm"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">SEO</h3>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.seo.title}
                onChange={(e) => handleNestedChange("seo", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.seo.description}
                onChange={(e) => handleNestedChange("seo", "description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input
                value={formData.seo.keywords.join(", ")}
                onChange={(e) =>
                  handleNestedChange(
                    "seo",
                    "keywords",
                    e.target.value.split(",").map((k) => k.trim())
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
