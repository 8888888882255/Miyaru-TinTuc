/**
 * MongoDB Sample Data Seeding Script
 * Creates sample users for development and testing
 * 
 * Run locally:
 * node scripts/seed-data.js
 * 
 * Run on Vercel:
 * Create API endpoint /api/admin/seed
 */

import mongoose from "mongoose";
import { User } from "../src/models/user.model";
import { UserRole, UserStatus } from "../src/models/enums";

const sampleUsers = [
  {
    fullName: "Super Admin",
    email: "superadmin@miyaru.local",
    emailVerified: true,
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    trustScore: 100,
    avatar: {
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin",
      alt: "Super Admin Avatar"
    },
    contact: {
      facebookPrimary: "https://facebook.com/superadmin",
      zalo: "0123456789",
      website: "https://example.com"
    },
    insurance: {
      amount: 10000000,
      currency: "VND"
    },
    details: [
      {
        title: "MB Bank",
        content: "1234567890 - Super Admin"
      },
      {
        title: "TP Bank",
        content: "0987654321 - Super Admin"
      }
    ],
    seo: {
      title: "Super Admin - System Manager",
      description: "Super Administrator with full system access",
      keywords: ["admin", "super", "system", "manager"]
    },
    auth: {
      provider: "google",
      providerAccountId: "super_admin_001"
    },
    joinedAt: new Date("2025-01-01"),
    lastLoginAt: new Date()
  },
  {
    fullName: "Admin User",
    email: "admin@miyaru.local",
    emailVerified: true,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    trustScore: 90,
    avatar: {
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      alt: "Admin User Avatar"
    },
    contact: {
      facebookPrimary: "https://facebook.com/adminuser",
      zalo: "0123456789",
      website: "https://example.com"
    },
    insurance: {
      amount: 5000000,
      currency: "VND"
    },
    details: [
      {
        title: "MB Bank",
        content: "1111111111 - Admin User"
      }
    ],
    seo: {
      title: "Admin User - Content Manager",
      description: "Administrator responsible for content management",
      keywords: ["admin", "content", "manager"]
    },
    auth: {
      provider: "google",
      providerAccountId: "admin_user_001"
    },
    joinedAt: new Date("2025-01-05"),
    lastLoginAt: new Date()
  },
  {
    fullName: "John Doe",
    email: "john.doe@miyaru.local",
    emailVerified: true,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    trustScore: 85,
    avatar: {
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
      alt: "John Doe Avatar"
    },
    contact: {
      facebookPrimary: "https://facebook.com/johndoe",
      zalo: "0987654321",
      website: "https://johndoe.com"
    },
    insurance: {
      amount: 3000000,
      currency: "VND"
    },
    details: [
      {
        title: "Vietcombank",
        content: "2222222222 - John Doe"
      }
    ],
    seo: {
      title: "John Doe - Trusted Seller",
      description: "John Doe is a trusted transaction verification expert",
      keywords: ["john", "trusted", "seller", "verification"]
    },
    auth: {
      provider: "google",
      providerAccountId: "john_doe_001"
    },
    joinedAt: new Date("2025-01-10"),
    lastLoginAt: new Date()
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@miyaru.local",
    emailVerified: true,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    trustScore: 92,
    avatar: {
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=janesmith",
      alt: "Jane Smith Avatar"
    },
    contact: {
      facebookPrimary: "https://facebook.com/janesmith",
      zalo: "0555555555",
      website: "https://janesmith.com"
    },
    insurance: {
      amount: 7000000,
      currency: "VND"
    },
    details: [
      {
        title: "ACB Bank",
        content: "3333333333 - Jane Smith"
      },
      {
        title: "Techcombank",
        content: "4444444444 - Jane Smith"
      }
    ],
    seo: {
      title: "Jane Smith - Transaction Expert",
      description: "Jane Smith specializes in secure transactions",
      keywords: ["jane", "expert", "transaction", "secure"]
    },
    auth: {
      provider: "google",
      providerAccountId: "jane_smith_001"
    },
    joinedAt: new Date("2025-01-08"),
    lastLoginAt: new Date()
  },
  {
    fullName: "Bob Wilson",
    email: "bob.wilson@miyaru.local",
    emailVerified: false,
    role: UserRole.USER,
    status: UserStatus.INACTIVE,
    trustScore: 45,
    avatar: {
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bobwilson",
      alt: "Bob Wilson Avatar"
    },
    contact: {
      facebookPrimary: "https://facebook.com/bobwilson"
    },
    insurance: {
      amount: 1000000,
      currency: "VND"
    },
    details: [],
    seo: {
      title: "Bob Wilson",
      description: "New user profile",
      keywords: ["bob", "new", "user"]
    },
    auth: {
      provider: "google",
      providerAccountId: "bob_wilson_001"
    },
    joinedAt: new Date("2025-01-15"),
    lastLoginAt: null
  },
  {
    fullName: "Alice Johnson",
    email: "alice.johnson@miyaru.local",
    emailVerified: true,
    role: UserRole.USER,
    status: UserStatus.BANNED,
    trustScore: 10,
    avatar: {
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alicejohnson",
      alt: "Alice Johnson Avatar"
    },
    contact: {},
    insurance: {
      amount: 0,
      currency: "VND"
    },
    details: [],
    seo: {
      title: "Alice Johnson",
      description: "Banned user account",
      keywords: ["alice", "banned"]
    },
    auth: {
      provider: "google",
      providerAccountId: "alice_johnson_001"
    },
    joinedAt: new Date("2024-12-01"),
    lastLoginAt: new Date("2025-01-01")
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing users (optional - comment out to keep existing data)
    // const deleteResult = await User.deleteMany({});
    // console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing users`);

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers, {
      ordered: false // Continue on error
    });

    console.log(`✅ Seeded ${insertedUsers.length} sample users`);

    // Print seeded users
    console.log("\n📋 Seeded Users:");
    console.log("=====================================");
    insertedUsers.forEach((user: any, index: number) => {
      console.log(`${index + 1}. ${user.fullName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Trust Score: ${user.trustScore}`);
      console.log("");
    });

    // Get total count
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);

  } catch (error: any) {
    if (error.code === 11000) {
      console.error("⚠️  Duplicate key error - some users may already exist");
      console.error("   Run with deleteMany() enabled to clear existing data");
    } else {
      console.error("❌ Error seeding database:", error.message);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
