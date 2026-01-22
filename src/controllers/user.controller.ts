import {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  searchUsers,
  filterUsers,
} from "@/services/user.service";
import { IUser } from "@/models/user.model";
import { UserRole, UserStatus } from "@/models/enums";

// CREATE
export async function createUserController(data: Partial<IUser>) {
  try {
    // Validate required fields
    if (!data.fullName || !data.email) {
      throw new Error("fullName and email are required");
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = await createUser(data);
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// READ - Get all users with pagination
export async function getUsersController(
  page: number = 1,
  limit: number = 10,
  role?: UserRole,
  status?: UserStatus,
  search?: string
) {
  try {
    const result = await getAllUsers(page, limit, { role, status, search });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// READ - Get single user
export async function getUserController(id: string) {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    const user = await findUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// UPDATE
export async function updateUserController(id: string, data: Partial<IUser>) {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    // If email is being updated, check for duplicates
    if (data.email) {
      const existingUser = await findUserByEmail(data.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error("Email already exists");
      }
    }

    const user = await updateUser(id, data);
    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// DELETE
export async function deleteUserController(id: string) {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    const user = await deleteUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// SEARCH
export async function searchUsersController(
  searchTerm: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    if (!searchTerm) {
      throw new Error("Search term is required");
    }

    const result = await searchUsers(searchTerm, page, limit);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// FILTER
export async function filterUsersController(
  filters: {
    role?: UserRole;
    status?: UserStatus;
    minTrustScore?: number;
    maxTrustScore?: number;
    startDate?: string;
    endDate?: string;
  },
  page: number = 1,
  limit: number = 10
) {
  try {
    const parsedFilters: any = { ...filters };

    if (filters.startDate) {
      parsedFilters.startDate = new Date(filters.startDate);
    }

    if (filters.endDate) {
      parsedFilters.endDate = new Date(filters.endDate);
    }

    const result = await filterUsers(parsedFilters, page, limit);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
