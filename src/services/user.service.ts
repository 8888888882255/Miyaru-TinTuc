import { User, IUser } from "@/models/user.model";
import { UserRole, UserStatus } from "@/models/enums";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// CREATE
export async function createUser(data: Partial<IUser>) {
  const slug = generateSlug(data.fullName || "");
  
  // Check if slug exists
  let finalSlug = slug;
  let counter = 1;
  while (await User.findOne({ slug: finalSlug })) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const userData = {
    ...data,
    slug: finalSlug,
    emailVerified: false,
    joinedAt: new Date(),
    status: UserStatus.ACTIVE,
    role: data.role || UserRole.USER,
  };

  return User.create(userData);
}

// READ
export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function findUserById(id: string) {
  return User.findById(id);
}

export async function findUserBySlug(slug: string) {
  return User.findOne({ slug });
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  }
) {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filters?.role) {
    query.role = filters.role;
  }

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.search) {
    query.$or = [
      { fullName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
      { slug: { $regex: filters.search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

// UPDATE
export async function updateUser(id: string, data: Partial<IUser>) {
  // If fullName is updated, regenerate slug
  if (data.fullName) {
    const slug = generateSlug(data.fullName);
    
    // Check if new slug conflicts
    const existingUser = await User.findOne({ slug, _id: { $ne: id } });
    if (!existingUser) {
      data.slug = slug;
    }
  }

  data.updatedAt = new Date();

  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

// DELETE
export async function deleteUser(id: string) {
  return User.findByIdAndDelete(id);
}

// SEARCH & FILTER
export async function searchUsers(
  searchTerm: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  
  const query = {
    $or: [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { slug: { $regex: searchTerm, $options: "i" } },
    ],
  };

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function filterUsers(
  filters: {
    role?: UserRole;
    status?: UserStatus;
    minTrustScore?: number;
    maxTrustScore?: number;
    startDate?: Date;
    endDate?: Date;
  },
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.minTrustScore !== undefined || filters.maxTrustScore !== undefined) {
    query.trustScore = {};
    if (filters.minTrustScore !== undefined) {
      query.trustScore.$gte = filters.minTrustScore;
    }
    if (filters.maxTrustScore !== undefined) {
      query.trustScore.$lte = filters.maxTrustScore;
    }
  }

  if (filters.startDate || filters.endDate) {
    query.joinedAt = {};
    if (filters.startDate) {
      query.joinedAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.joinedAt.$lte = filters.endDate;
    }
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
