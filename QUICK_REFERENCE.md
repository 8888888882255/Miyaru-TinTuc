# Quick Reference - User Management System

## 🚀 Development Commands

```bash
# Start development server
npm run dev
# Access at http://localhost:3000

# Build production bundle
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📊 Admin Dashboard Routes

```
http://localhost:3000/admin              → Main dashboard
http://localhost:3000/admin/users        → Users management page
http://localhost:3000/admin/list         → List view (legacy)
```

## 🔐 Authentication

### Get JWT Token (Example - Replace with your auth provider)

```bash
# After login, token is stored in localStorage
# Access it with: localStorage.getItem('token')

# Token format in API requests:
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### JWT Token Expiration
- **Expiration**: 7 days
- **Refresh**: Not yet implemented (roadmap)

## 📡 API Endpoints Quick Reference

### List Users
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"

# With role filter
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&role=admin" \
  -H "Authorization: Bearer TOKEN"

# With status filter
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&status=active" \
  -H "Authorization: Bearer TOKEN"

# With search
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer TOKEN"
```

### Search Users
```bash
curl -X GET "http://localhost:3000/api/users/search?q=john&page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Filter Users
```bash
curl -X POST "http://localhost:3000/api/users/filter" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "filters": {
      "role": "admin",
      "status": "active",
      "minTrustScore": 80,
      "maxTrustScore": 100,
      "startDate": "2025-01-01",
      "endDate": "2026-01-31"
    },
    "page": 1,
    "limit": 10
  }'
```

### Create User
```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "trustScore": 85,
    "avatar": {
      "url": "https://example.com/avatar.jpg",
      "alt": "John Doe"
    },
    "contact": {
      "facebookPrimary": "https://facebook.com/johndoe",
      "zalo": "0123456789",
      "website": "https://johndoe.com"
    },
    "insurance": {
      "amount": 5000000,
      "currency": "VND"
    },
    "details": [
      {
        "title": "MB Bank",
        "content": "1234567890 - John Doe"
      }
    ],
    "seo": {
      "title": "John Doe - Trusted Seller",
      "description": "John Doe is a trusted transaction expert",
      "keywords": ["john", "trusted", "seller"]
    }
  }'
```

### Update User
```bash
curl -X PUT "http://localhost:3000/api/users?id=USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "fullName": "Jane Doe",
    "trustScore": 90,
    "status": "active"
  }'
```

### Delete User (Super Admin Only)
```bash
curl -X DELETE "http://localhost:3000/api/users?id=USER_ID" \
  -H "Authorization: Bearer TOKEN"
```

## 🗄️ Environment Variables

### Local (.env.local)
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters_here

# Environment
NODE_ENV=development

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Production (Vercel)
Set the same variables in Vercel Project Settings → Environment Variables

## 📋 User Roles & Permissions

```
┌─────────────────┬─────────────────┬─────────────────┬──────────────┐
│ Action          │ User (Level 1)  │ Admin (Level 2) │ Super Admin  │
├─────────────────┼─────────────────┼─────────────────┼──────────────┤
│ View own        │ ✅              │ ✅              │ ✅           │
│ List all        │ ❌              │ ✅              │ ✅           │
│ Create          │ ❌              │ ✅              │ ✅           │
│ Update          │ Own only        │ ✅              │ ✅           │
│ Delete          │ ❌              │ ❌              │ ✅           │
│ Change role     │ ❌              │ ❌              │ ✅           │
│ Manage admins   │ ❌              │ ❌              │ ✅           │
└─────────────────┴─────────────────┴─────────────────┴──────────────┘
```

## 🔍 Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Filters
- `role`: "user" | "admin" | "super_admin"
- `status`: "active" | "inactive" | "banned"
- `search`: Search term for name, email, slug
- `minTrustScore`: 0-100
- `maxTrustScore`: 0-100
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

## 📦 Response Formats

### Success Response (List)
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "status": "active",
      "trustScore": 85,
      "joinedAt": "2025-01-22T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "error": "Email already exists"
}
```

## 🛠️ Mongoose Schema Indexes

```javascript
// Create these indexes for better performance:

// Unique indexes
db.nguoi_dungs.createIndex({ email: 1 }, { unique: true })
db.nguoi_dungs.createIndex({ slug: 1 }, { unique: true })

// Query indexes
db.nguoi_dungs.createIndex({ role: 1 })
db.nguoi_dungs.createIndex({ status: 1 })
db.nguoi_dungs.createIndex({ createdAt: -1 })

// Text search index
db.nguoi_dungs.createIndex({
  fullName: "text",
  "seo.title": "text",
  "seo.description": "text",
  "seo.keywords": "text"
})
```

## 🚀 Vercel Deployment Checklist

- [ ] GitHub repository set up and code pushed
- [ ] MongoDB Atlas cluster created and configured
- [ ] Whitelist Vercel's IP addresses in MongoDB
- [ ] Environment variables added to Vercel project
- [ ] Database indexes created
- [ ] Initial user seeded (for testing)
- [ ] Admin account created with super_admin role
- [ ] Test API endpoints work
- [ ] Test admin dashboard loads
- [ ] Monitor Vercel dashboard for errors

## 🐛 Debugging Tips

### Check MongoDB Connection
```bash
# In your code, log the URI (without password):
console.log(process.env.MONGODB_URI.split('@')[0])

# Should output: mongodb+srv://username:***
```

### View Vercel Logs
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# View logs
vercel logs [deployment-url]
```

### Test JWT Token
```bash
# Decode token (without verification):
# Visit https://jwt.io and paste your token

# Or decode in Node.js:
const jwt = require('jsonwebtoken');
const decoded = jwt.decode('YOUR_TOKEN');
console.log(decoded);
```

## 📱 Common Curl Examples

### Login and Get Token
```bash
# Replace with your actual login endpoint
curl -X POST "http://localhost:3000/api/auth/google" \
  -H "Content-Type: application/json" \
  -d '{"googleToken": "GOOGLE_TOKEN"}'

# Response will include JWT token
# Store in: localStorage.setItem('token', response.token)
```

### Using Token in Requests
```bash
# Set header
TOKEN=$(cat .token)  # From login response
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Database Connection String Examples

```
# MongoDB Atlas
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Local MongoDB (development)
mongodb://localhost:27017/miyaru_db

# With authentication
mongodb://username:password@localhost:27017/miyaru_db
```

## 🔗 Useful Links

- [MongoDB Atlas Console](https://cloud.mongodb.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com)
- [JWT.io - Decode Tokens](https://jwt.io)
- [REST API Tester - Postman](https://postman.com)

## 💡 Pro Tips

1. **Use Postman** for testing APIs instead of curl
2. **Enable MongoDB Slow Query Log** to identify bottlenecks
3. **Set up Vercel Analytics** to monitor performance
4. **Use Mongoose Lean** for read-only queries (.lean())
5. **Implement caching** for frequently accessed data
6. **Create database backups** regularly
7. **Monitor token expiration** and implement refresh mechanism
8. **Use MongoDB Compass** for visual database management

---

For more information, see:
- [README_USER_MANAGEMENT.md](./README_USER_MANAGEMENT.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
