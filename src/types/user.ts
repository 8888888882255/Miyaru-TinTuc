// User types matching users.json structure
export interface UserAvatar {
  url: string;
  alt: string;
}

export interface UserAuth {
  provider: string;
  providerAccountId?: string;
}

export interface UserContact {
  facebookPrimary?: string;
  facebookSecondary?: string;
  zalo?: string;
  website?: string;
}

export interface UserInsurance {
  amount: number;
  currency: string;
}

export interface UserDetail {
  title: string;
  content: string;
}

export interface UserSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface User {
  _id?: {
    $oid: string;
  };
  id?: string;
  fullName: string;
  slug: string;
  email?: string;
  emailVerified?: boolean;
  role: "admin" | "super_admin" | "user";
  trustScore?: number;
  avatar: UserAvatar | string; // Can be string for backward compatibility
  status: "active" | "inactive";
  joinedAt?: string | { $date: string };
  lastLoginAt?: string | { $date: string };
  auth?: UserAuth;
  contact?: UserContact;
  insurance?: UserInsurance;
  details?: UserDetail[];
  seo?: UserSEO;
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
  // Legacy fields for backward compatibility
  name?: string;
  soTaiKhoan?: string;
  nganHang?: string;
  ngayThamGia?: string;
  facebook?: unknown;
  zalo?: string;
  web?: string;
  baoHiem?: unknown;
  dichVu?: string[];
  chuTaiKhoan?: string;
  stkKhac?: unknown[];
}

// Utility function to normalize date fields
export function normalizeUser(user: User): User {
  return {
    ...user,
    joinedAt: normalizeDate(user.joinedAt),
    lastLoginAt: normalizeDate(user.lastLoginAt),
    createdAt: normalizeDate(user.createdAt),
    updatedAt: normalizeDate(user.updatedAt),
  };
}

export function normalizeDate(date: unknown): string | undefined {
  if (!date) return undefined;
  if (typeof date === "string") return date;
  if (date && typeof date === "object" && "$date" in date) {
    // @ts-ignore
    return date.$date as string;
  }
  return undefined;
}

// Utility to get avatar URL
export function getAvatarUrl(avatar: UserAvatar | string | undefined): string {
  if (!avatar) return "";
  if (typeof avatar === "string") return avatar;
  return avatar.url || "";
}

// Utility to get avatar alt text
export function getAvatarAlt(avatar: UserAvatar | string | undefined): string {
  if (!avatar) return "";
  if (typeof avatar === "string") return avatar;
  return avatar.alt || "";
}
