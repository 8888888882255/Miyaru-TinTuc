/**
 * User Client Service
 * Kết nối frontend với API backend
 * 
 * Usage:
 * const users = await userClientService.getUsers(1, 10);
 * await userClientService.createUser(userData);
 * await userClientService.updateUser(id, userData);
 * await userClientService.deleteUser(id);
 */

interface FetchOptions {
  token?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface User {
  _id: string;
  fullName: string;
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
    facebookSecondary?: string;
    zalo?: string;
    website?: string;
  };
  insurance?: {
    amount: number;
    currency: string;
  };
  details?: Array<{
    title: string;
    content: string;
  }>;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  joinedAt: string;
  lastLoginAt?: string;
}

interface CreateUserInput {
  fullName: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "inactive" | "banned";
  trustScore?: number;
  avatar?: {
    url: string;
    alt: string;
  };
  contact?: {
    facebookPrimary?: string;
    facebookSecondary?: string;
    zalo?: string;
    website?: string;
  };
  insurance?: {
    amount: number;
    currency: string;
  };
  details?: Array<{
    title: string;
    content: string;
  }>;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

interface FilterCriteria {
  role?: "user" | "admin" | "super_admin";
  status?: "active" | "inactive" | "banned";
  minTrustScore?: number;
  maxTrustScore?: number;
  startDate?: string;
  endDate?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class UserClientService {
  /**
   * Get authorization token
   */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  /**
   * Make authenticated fetch request
   */
  private async fetchWithAuth<T>(
    url: string,
    options: RequestInit = {},
    requireAuth = true
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();

    if (requireAuth && !token) {
      throw new Error("Authentication token not found. Please login first.");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters?: {
      role?: string;
      status?: string;
      search?: string;
    }
  ): Promise<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await this.fetchWithAuth<User[]>(
      `${API_BASE_URL}/api/users?${params}`
    );

    return {
      data: response.data || [],
      pagination: response.pagination || {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Search users by keyword
   */
  async searchUsers(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const params = new URLSearchParams({
      q: searchTerm,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await this.fetchWithAuth<User[]>(
      `${API_BASE_URL}/api/users/search?${params}`
    );

    return {
      data: response.data || [],
      pagination: response.pagination || {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Filter users by criteria
   */
  async filterUsers(
    filters: FilterCriteria,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await this.fetchWithAuth<User[]>(
      `${API_BASE_URL}/api/users/filter`,
      {
        method: "POST",
        body: JSON.stringify({
          filters,
          page,
          limit,
        }),
      }
    );

    return {
      data: response.data || [],
      pagination: response.pagination || {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await this.fetchWithAuth<User>(
      `${API_BASE_URL}/api/users/${id}`
    );

    if (!response.data) {
      throw new Error("User not found");
    }

    return response.data;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserInput): Promise<User> {
    // Validate required fields
    if (!data.fullName || !data.email || !data.role) {
      throw new Error("Missing required fields: fullName, email, role");
    }

    const response = await this.fetchWithAuth<User>(
      `${API_BASE_URL}/api/users`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.data) {
      throw new Error("Failed to create user");
    }

    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<CreateUserInput>): Promise<User> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await this.fetchWithAuth<User>(
      `${API_BASE_URL}/api/users?id=${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    if (!response.data) {
      throw new Error("Failed to update user");
    }

    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await this.fetchWithAuth(
      `${API_BASE_URL}/api/users?id=${id}`,
      {
        method: "DELETE",
      }
    );

    return {
      success: response.success || false,
      message: response.error || "User deleted successfully",
    };
  }

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    bannedUsers: number;
    avgTrustScore: number;
    usersByRole: {
      user: number;
      admin: number;
      super_admin: number;
    };
    usersByStatus: {
      active: number;
      inactive: number;
      banned: number;
    };
  }> {
    const response = await this.getUsers(1, 1000);
    const users = response.data;

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const inactiveUsers = users.filter((u) => u.status === "inactive").length;
    const bannedUsers = users.filter((u) => u.status === "banned").length;
    const avgTrustScore =
      users.length > 0
        ? Math.round(
            users.reduce((sum, u) => sum + u.trustScore, 0) / users.length
          )
        : 0;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      bannedUsers,
      avgTrustScore,
      usersByRole: {
        user: users.filter((u) => u.role === "user").length,
        admin: users.filter((u) => u.role === "admin").length,
        super_admin: users.filter((u) => u.role === "super_admin").length,
      },
      usersByStatus: {
        active: activeUsers,
        inactive: inactiveUsers,
        banned: bannedUsers,
      },
    };
  }

  /**
   * Logout and clear token
   */
  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export const userClientService = new UserClientService();
export type { User, CreateUserInput, FilterCriteria, ApiResponse };
