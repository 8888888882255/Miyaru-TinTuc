// src/models/enums.ts
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum Currency {
  VND = "VND",
  USD = "USD",
}

export enum AuthProvider {
  GOOGLE = "google",
}
