# Miyaru TinTuc - User Management System

Hệ thống quản lý người dùng toàn diện với role-based access control (RBAC), tích hợp MongoDB Atlas và deployment trên Vercel.

## 🎯 Tính Năng Chính

### 1. **User Management (CRUD)**
- ✅ Xem danh sách users (phân trang)
- ✅ Thêm user mới
- ✅ Sửa thông tin user
- ✅ Xóa user
- ✅ Xem chi tiết user

### 2. **Tìm Kiếm & Lọc**
- ✅ Tìm kiếm theo tên, email, slug
- ✅ Lọc theo role (User, Admin, Super Admin)
- ✅ Lọc theo status (Active, Inactive, Banned)
- ✅ Lọc theo trust score range
- ✅ Lọc theo ngày tham gia
- ✅ Kết hợp nhiều filters

### 3. **Role-Based Access Control (RBAC)**
```
Super Admin (Level 3)
├── Quản lý tất cả users
├── Xóa users
├── Phê duyệt admin mới
└── Truy cập tất cả tính năng

Admin (Level 2)
├── Xem danh sách users
├── Thêm/sửa users
├── Không thể xóa users
└── Limited access

User (Level 1)
├── Xem profile của mình
├── Cập nhật info cơ bản
└── Không có quyền quản lý
```

### 4. **Admin Dashboard**
- 📊 Thống kê users
- 👥 Bảng users có phân trang
- 🔍 Tìm kiếm nhanh
- 🎯 Advanced filters
- 🎨 Responsive UI with Shadcn/UI

## 📊 User Data Structure

```typescript
{
  _id: ObjectId
  fullName: string
  slug: string (auto-generated from fullName)
  email: string (unique)
  emailVerified: boolean
  
  role: "user" | "admin" | "super_admin"
  status: "active" | "inactive" | "banned"
  trustScore: number (0-100)
  
  avatar: {
    url: string
    alt: string
  }
  
  contact: {
    facebookPrimary?: string
    facebookSecondary?: string
    zalo?: string
    website?: string
  }
  
  insurance: {
    amount: number
    currency: "VND" | "USD"
  }
  
  details: [{
    title: string
    content: string
  }]
  
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  
  joinedAt: Date
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Công Nghệ Sử Dụng

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Shadcn/UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form**: React Hook Form

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **ORM**: Mongoose

### Deployment
- **Hosting**: Vercel
- **Database**: MongoDB Atlas
- **Version Control**: Git/GitHub

## 📁 Folder Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx (Dashboard)
│   │   └── users/
│   │       └── page.tsx (Users Management)
│   ├── api/
│   │   └── users/
│   │       ├── route.ts (CRUD endpoints)
│   │       ├── search/route.ts (Search endpoint)
│   │       └── filter/route.ts (Filter endpoint)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── UserModal.tsx (Add/Edit user form)
│   ├── FilterDialog.tsx (Advanced filter)
│   ├── CustomPagination.tsx (Pagination)
│   ├── AdminLayout.tsx
│   └── ui/ (Shadcn/UI components)
├── controllers/
│   ├── auth.controller.ts
│   └── user.controller.ts (CRUD operations)
├── services/
│   ├── user.service.ts (Database queries)
│   ├── auth.service.ts
│   └── news.service.ts
├── models/
│   ├── user.model.ts (Mongoose schema)
│   ├── enums.ts (UserRole, UserStatus, etc)
│   └── news.model.ts
├── lib/
│   ├── auth.ts (JWT, token verification)
│   ├── mongodb.ts (DB connection)
│   └── session.ts
├── hooks/
│   └── use-toast.ts
└── middleware.ts (RBAC enforcement)
```

## 🔌 API Endpoints

### Users Management

```
GET /api/users
  Query: page, limit, role, status, search
  Returns: { data, pagination }
  Auth: ADMIN+

POST /api/users
  Body: User data
  Returns: Created user
  Auth: ADMIN+

PUT /api/users?id=USER_ID
  Body: Updated fields
  Returns: Updated user
  Auth: ADMIN+

DELETE /api/users?id=USER_ID
  Returns: { message }
  Auth: SUPER_ADMIN only

GET /api/users/search?q=TERM&page=PAGE&limit=LIMIT
  Returns: { data, pagination }
  Auth: USER+

POST /api/users/filter
  Body: { filters: {...}, page, limit }
  Returns: { data, pagination }
  Auth: USER+
```

## 🔐 Authentication & Authorization

### JWT Token Payload
```typescript
{
  uid: string (user ID)
  email: string
  role: "user" | "admin" | "super_admin"
  iat: number (issued at)
  exp: number (expiration)
}
```

### Middleware Protection
- `/admin/*` → Requires ADMIN+ role
- `/api/users/*` → Requires authentication
- `/api/admin/*` → Requires ADMIN+ role

## 📝 Environment Variables

### Development (.env.local)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### Production (.env.production)
Cập nhật tương tự trong Vercel dashboard

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deployment to Vercel

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy user management system"
git push origin main

# 2. Go to vercel.com and import the repository
# 3. Add environment variables
# 4. Deploy (automatic)
```

Chi tiết xem [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🧪 Testing

### Test Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "trustScore": 85
  }'
```

### Test Search Users
```bash
curl http://localhost:3000/api/users/search?q=john \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Filter Users
```bash
curl -X POST http://localhost:3000/api/users/filter \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "filters": {
      "role": "admin",
      "status": "active",
      "minTrustScore": 80
    },
    "page": 1,
    "limit": 10
  }'
```

## 📊 Performance Optimization

### Database Indexes (MongoDB)
```javascript
db.nguoi_dungs.createIndex({ email: 1 }, { unique: true })
db.nguoi_dungs.createIndex({ slug: 1 }, { unique: true })
db.nguoi_dungs.createIndex({ role: 1 })
db.nguoi_dungs.createIndex({ status: 1 })
db.nguoi_dungs.createIndex({ createdAt: -1 })
db.nguoi_dungs.createIndex({
  fullName: "text",
  "seo.title": "text",
  "seo.description": "text"
})
```

### Query Optimization
- Pagination: 10 items per page (configurable)
- Indexed fields for fast searching
- Text search indexes for full-text search
- Sorted by createdAt descending

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Solution: Verify MongoDB URI and whitelist IP in Atlas
```

### JWT Token Expired
```
Token expires in 7 days. Implement refresh token mechanism
```

### Rate Limiting
```
Consider adding rate limiting for production (e.g., express-rate-limit)
```

## 📚 Documentation

- [MongoDB Documentation](https://docs.mongodb.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com)

## 🔐 Security Best Practices

- ✅ Never commit .env files
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Rotate secrets regularly
- ✅ Enable HTTPS (automatic with Vercel)
- ✅ Validate all user inputs
- ✅ Use parameterized queries (Mongoose handles this)
- ✅ Implement rate limiting in production
- ✅ Keep dependencies updated

## 📈 Roadmap

- [ ] Refresh token implementation
- [ ] Two-factor authentication (2FA)
- [ ] User activity logging
- [ ] Email notifications
- [ ] Data export (CSV, PDF)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review error logs in Vercel dashboard
3. Check MongoDB Atlas status
4. Contact team

## 📄 License

MIT License - Feel free to use in your projects

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Author**: Miyaru Development Team
