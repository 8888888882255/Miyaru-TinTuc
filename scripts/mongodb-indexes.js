/**
 * MongoDB Index Setup Script
 * Run this in MongoDB Atlas dashboard or Mongosh
 * 
 * Purpose: Create necessary indexes for optimal query performance
 * 
 * Usage:
 * 1. Go to MongoDB Atlas dashboard
 * 2. Click "CONNECT" → "Connect with MongoDB Shell"
 * 3. Copy-paste the commands below
 * OR
 * 1. Use MongoDB Compass
 * 2. Open "Aggregations" tab
 * 3. Paste commands
 */

// MongoDB Connection String: mongodb+srv://user:password@cluster.mongodb.net/miyaru_db?retryWrites=true&w=majority
// Database: miyaru_db
// Collection: nguoi_dungs

// ============================================
// UNIQUE INDEXES (Constraint)
// ============================================

// Index for email field (must be unique)
db.nguoi_dungs.createIndex(
  { email: 1 },
  { unique: true, name: "email_unique" }
);

// Index for slug field (must be unique)
db.nguoi_dungs.createIndex(
  { slug: 1 },
  { unique: true, name: "slug_unique" }
);

// ============================================
// QUERY INDEXES (Performance)
// ============================================

// Index for role-based queries
db.nguoi_dungs.createIndex(
  { role: 1 },
  { name: "role_index" }
);

// Index for status-based queries
db.nguoi_dungs.createIndex(
  { status: 1 },
  { name: "status_index" }
);

// Index for sorting by creation date
db.nguoi_dungs.createIndex(
  { createdAt: -1 },
  { name: "createdAt_desc" }
);

// Index for trust score range queries
db.nguoi_dungs.createIndex(
  { trustScore: 1 },
  { name: "trustScore_index" }
);

// Index for joined date range queries
db.nguoi_dungs.createIndex(
  { joinedAt: 1 },
  { name: "joinedAt_index" }
);

// Compound index for common filters
db.nguoi_dungs.createIndex(
  { role: 1, status: 1, createdAt: -1 },
  { name: "role_status_created_compound" }
);

// ============================================
// TEXT SEARCH INDEX
// ============================================

// Full-text search index for name, email, seo fields
db.nguoi_dungs.createIndex(
  {
    fullName: "text",
    slug: "text",
    email: "text",
    "seo.title": "text",
    "seo.description": "text",
    "seo.keywords": "text"
  },
  {
    name: "text_search_index",
    weights: {
      fullName: 10,        // Higher weight for fullName matches
      email: 8,
      "seo.title": 5,
      slug: 3
    },
    default_language: "english"
  }
);

// ============================================
// VERIFY INDEXES
// ============================================

// List all indexes on the collection
db.nguoi_dungs.getIndexes();

// Get index statistics
db.nguoi_dungs.aggregate([{ $indexStats: {} }]);

// ============================================
// OPTIONAL INDEXES (for advanced features)
// ============================================

// If implementing activity logging
// db.nguoi_dungs.createIndex(
//   { lastLoginAt: -1 },
//   { name: "lastLoginAt_index" }
// );

// If implementing soft deletes
// db.nguoi_dungs.createIndex(
//   { deletedAt: 1 },
//   { sparse: true, name: "deletedAt_index" }
// );

// ============================================
// PERFORMANCE MONITORING QUERIES
// ============================================

// Query to check which indexes are being used
db.nguoi_dungs.aggregate([
  { $match: { role: "admin" } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Explain query execution plan
db.nguoi_dungs.find({ role: "admin", status: "active" }).explain("executionStats");

// ============================================
// INDEX MANAGEMENT COMMANDS
// ============================================

// Remove an index (if needed)
// db.nguoi_dungs.dropIndex("email_unique");

// Remove all indexes except _id
// db.nguoi_dungs.dropIndexes();

// Rebuild all indexes
// db.nguoi_dungs.reIndex();

// ============================================
// BULK WRITE OPERATIONS
// ============================================

// Example: Bulk insert sample users (for testing)
db.nguoi_dungs.insertMany([
  {
    fullName: "Super Admin",
    slug: "super-admin",
    email: "superadmin@example.com",
    emailVerified: true,
    role: "super_admin",
    status: "active",
    trustScore: 100,
    avatar: {
      url: "https://example.com/super-admin.jpg",
      alt: "Super Admin"
    },
    contact: {},
    insurance: { amount: 0, currency: "VND" },
    details: [],
    seo: {
      title: "Super Admin",
      description: "System Administrator",
      keywords: ["admin", "system"]
    },
    auth: {
      provider: "google",
      providerAccountId: "000000000000000000"
    },
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    fullName: "Admin User",
    slug: "admin-user",
    email: "admin@example.com",
    emailVerified: true,
    role: "admin",
    status: "active",
    trustScore: 85,
    avatar: {
      url: "https://example.com/admin.jpg",
      alt: "Admin User"
    },
    contact: {},
    insurance: { amount: 5000000, currency: "VND" },
    details: [
      { title: "MB Bank", content: "1234567890 - Admin User" }
    ],
    seo: {
      title: "Admin User",
      description: "System Administrator",
      keywords: ["admin"]
    },
    auth: {
      provider: "google",
      providerAccountId: "111111111111111111"
    },
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ============================================
// COLLECTION STATISTICS
// ============================================

// Get collection stats
db.nguoi_dungs.stats();

// Get database stats
db.stats();

// Count documents
db.nguoi_dungs.countDocuments();

// Get document size in bytes
db.nguoi_dungs.aggregate([
  { $group: { _id: null, avgSize: { $avg: { $bsonSize: "$$ROOT" } } } }
]);

// ============================================
// NOTES
// ============================================

/*
Index Naming Convention:
- email_unique: For unique email constraint
- slug_unique: For unique slug constraint
- role_index: Single field index
- role_status_created_compound: Compound index
- text_search_index: Full-text search index
- *_desc: Descending order (for sorting)

Best Practices:
1. Create indexes before production deployment
2. Monitor index performance using MongoDB Atlas UI
3. Drop unused indexes to reduce write overhead
4. Use compound indexes for common query patterns
5. Include field order in compound indexes carefully
6. Consider query patterns when designing indexes

Performance Tips:
1. Use explain() to analyze query plans
2. Check if queries use indexes with executionStats
3. Aim for covered queries when possible
4. Monitor slow queries in MongoDB Atlas
5. Rebuild indexes periodically for optimization
*/
