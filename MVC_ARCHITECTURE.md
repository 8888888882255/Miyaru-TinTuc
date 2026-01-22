import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});import { userClientService } from "@/services/user.client";

// Lấy danh sách users
const { data, pagination } = await userClientService.getUsers(1, 10);

// Tạo user mới
await userClientService.createUser({
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Cập nhật user
await userClientService.updateUser(userId, { status: "active" });

// Xóa user
await userClientService.deleteUser(userId);

// Tìm kiếm
const results = await userClientService.searchUsers("john");

// Lọc nâng cao
const filtered = await userClientService.filterUsers({
  role: "admin",
  status: "active",
  minTrustScore: 80
});# 🏛️ MVC Architecture - MongoDB User Management System

## 📋 Tổng quan kiến trúc MVC

Hệ thống được xây dựng theo mô hình **MVC (Model-View-Controller)** với MongoDB là database backend.

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│              (UI Components & Pages)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   Pages    │  │ Components │  │   Hooks    │         │
│  └────────────┘  └────────────┘  └────────────┘         │
└────────────────────┬────────────────────────────────────┘
                     │ (Gọi API routes)
┌────────────────────▼────────────────────────────────────┐
│              API ROUTES LAYER                            │
│        (Next.js API Routes - Endpoints)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ GET      │  │ POST     │  │ PUT/DEL  │              │
│  │ /users   │  │ /users   │  │ /users   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │ (Gọi controllers)
┌────────────────────▼────────────────────────────────────┐
│          MIDDLEWARE LAYER                                │
│    (Authentication & Authorization)                     │
│         └─ JWT Verification                             │
│         └─ Role-Based Access Control                    │
└────────────────────┬────────────────────────────────────┘
                     │ (Gọi controllers)
┌────────────────────▼────────────────────────────────────┐
│         BUSINESS LOGIC LAYER                             │
│            (Controllers)                                │
│  ┌──────────────────────────────────────┐              │
│  │ user.controller.ts                   │              │
│  │ └─ validateInput()                   │              │
│  │ └─ checkDuplicate()                  │              │
│  │ └─ formatResponse()                  │              │
│  └──────────────────────────────────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │ (Gọi services)
┌────────────────────▼────────────────────────────────────┐
│           DATA ACCESS LAYER                              │
│             (Services)                                  │
│  ┌──────────────────────────────────────┐              │
│  │ user.service.ts                      │              │
│  │ └─ Database queries                  │              │
│  │ └─ Business logic                    │              │
│  │ └─ Data transformation               │              │
│  └──────────────────────────────────────┘              │
│  ┌──────────────────────────────────────┐              │
│  │ user.client.ts (Frontend)            │              │
│  │ └─ API client                        │              │
│  │ └─ Error handling                    │              │
│  │ └─ Token management                  │              │
│  └──────────────────────────────────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │ (Mongoose ORM)
┌────────────────────▼────────────────────────────────────┐
│              DATABASE LAYER                              │
│        (Models & Schemas)                               │
│  ┌──────────────────────────────────────┐              │
│  │ user.model.ts (Mongoose Schema)      │              │
│  │ └─ Define fields                     │              │
│  │ └─ Create indexes                    │              │
│  │ └─ Validate data                     │              │
│  └──────────────────────────────────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              MONGODB DATABASE                            │
│        (Cloud: MongoDB Atlas)                           │
│  ┌──────────────────────────────────────┐              │
│  │ Collection: nguoi_dungs              │              │
│  │ ┌────────────────────────────────┐   │              │
│  │ │ Document 1 (User)              │   │              │
│  │ │ { _id, fullName, email, ... }  │   │              │
│  │ │                                │   │              │
│  │ │ Document 2 (User)              │   │              │
│  │ │ { _id, fullName, email, ... }  │   │              │
│  │ └────────────────────────────────┘   │              │
│  └──────────────────────────────────────┘              │
└───────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc folder theo MVC

```
src/
│
├── models/                          # M - Model Layer
│   ├── user.model.ts               # Mongoose schema định nghĩa cấu trúc
│   └── enums.ts                    # Type definitions
│
├── controllers/                     # C - Controller Layer
│   ├── user.controller.ts          # Business logic + validation
│   └── auth.controller.ts          # Authentication logic
│
├── services/                        # Service/Data Access Layer
│   ├── user.service.ts             # Backend service (MongoDB queries)
│   └── user.client.ts              # Frontend service (API client)
│
├── app/                            # V - View Layer (Pages)
│   ├── admin/
│   │   ├── users/
│   │   │   └── page.tsx            # User management page
│   │   └── dashboard/
│   │       └── page.tsx            # Dashboard page
│   ├── api/                        # API Routes (Controller)
│   │   ├── users/
│   │   │   ├── route.ts            # GET, POST, PUT, DELETE
│   │   │   ├── search/
│   │   │   │   └── route.ts        # Search endpoint
│   │   │   └── filter/
│   │   │       └── route.ts        # Filter endpoint
│   │   ├── auth/
│   │   │   └── route.ts
│   │   └── google/
│   │       └── route.ts
│   └── middleware.ts               # Route protection + RBAC
│
├── components/                      # V - View Components
│   ├── UserModal.tsx               # Add/Edit form component
│   ├── FilterDialog.tsx            # Filter dialog component
│   ├── CustomPagination.tsx        # Pagination component
│   ├── AdminLayout.tsx             # Admin layout wrapper
│   ├── Header.tsx                  # Header component
│   ├── Footer.tsx                  # Footer component
│   └── ui/                         # Shadcn UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       └── ... (20+ components)
│
├── hooks/                           # Custom React hooks
│   ├── use-toast.ts                # Toast notification hook
│   └── use-mobile.tsx              # Mobile detection hook
│
└── lib/                             # Utilities
    ├── auth.ts                     # JWT utilities
    ├── mongodb.ts                  # Database connection
    ├── session.ts                  # Session management
    └── jwt.ts                      # JWT operations
```

---

## 🔄 Data Flow Chi Tiết

### 1️⃣ **Request Flow: User List**

```
┌─ Frontend (Browser) ─┐
│                      │
│ Admin clicks         │
│ "Users List"         │
│                      │
└─────────┬────────────┘
          │
          ▼
┌─ Page Component (admin/users/page.tsx) ─┐
│ ┌──────────────────────────────────┐     │
│ │ 1. useEffect hook triggers       │     │
│ │ 2. Calls userClientService       │     │
│ │ 3. getUsers(page=1, limit=10)    │     │
│ └──────────────────────────────────┘     │
└─────────────┬──────────────────────────────┘
              │
              ▼
┌─ Client Service (user.client.ts) ─┐
│ ┌──────────────────────────────┐   │
│ │ 1. Get token from localStorage│   │
│ │ 2. Build fetch URL            │   │
│ │ 3. Make HTTP GET request      │   │
│ │    GET /api/users?page=1...   │   │
│ │ 4. Add Authorization header   │   │
│ └──────────────────────────────┘   │
└─────────────┬──────────────────────────┘
              │
              ▼
┌─ API Route (app/api/users/route.ts) ─┐
│ ┌──────────────────────────────┐      │
│ │ 1. Extract JWT token         │      │
│ │ 2. Verify token signature    │      │
│ │ 3. Check role authorization  │      │
│ │ 4. Call controller           │      │
│ └──────────────────────────────┘      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─ Controller (user.controller.ts) ─┐
│ ┌──────────────────────────────┐   │
│ │ 1. Validate page, limit       │   │
│ │ 2. Call service.getAllUsers() │   │
│ │ 3. Format response            │   │
│ └──────────────────────────────┘   │
└─────────────┬──────────────────────────┘
              │
              ▼
┌─ Service (user.service.ts) ─┐
│ ┌────────────────────────┐   │
│ │ 1. Build Mongoose query│   │
│ │ 2. Execute findBy skip │   │
│ │ 3. Count total docs    │   │
│ │ 4. Return results      │   │
│ └────────────────────────┘   │
└─────────────┬────────────────────┘
              │
              ▼
┌─ MongoDB (Cloud: Atlas) ─┐
│ ┌──────────────────────┐  │
│ │ Collection: nguoi_dungs   │
│ │ 1. Find documents    │  │
│ │ 2. Skip: 0           │  │
│ │ 3. Limit: 10         │  │
│ │ 4. Return JSON       │  │
│ └──────────────────────┘  │
└──────────┬─────────────────┘
           │
           ▼ (Response JSON)
┌─ Service returns to Controller ─┐
│ {                                │
│   data: [user1, user2, ...],    │
│   pagination: {                  │
│     page: 1,                    │
│     total: 50,                  │
│     pages: 5                    │
│   }                              │
│ }                                │
└──────────┬──────────────────────┘
           │
           ▼
┌─ Controller returns to Route ─┐
│ {                              │
│   success: true,              │
│   data: [...],               │
│   pagination: {...}          │
│ }                              │
└──────────┬────────────────────┘
           │
           ▼ (HTTP 200 + JSON)
┌─ Route sends HTTP Response ─┐
│ Status: 200 OK              │
│ Body: {...}                 │
└──────────┬────────────────────┘
           │
           ▼
┌─ Client Service receives ─┐
│ 1. Parse JSON response    │
│ 2. Return typed data      │
│ 3. Throw on error         │
└──────────┬────────────────┘
           │
           ▼
┌─ Page Component ─┐
│ 1. setState       │
│ 2. Re-render      │
│ 3. Show table     │
│ 4. Hide loading   │
└──────────┬───────┘
           │
           ▼
┌─ User sees table ✅ ─┐
│ [User List Table]    │
└──────────────────────┘
```

### 2️⃣ **Request Flow: Create User**

```
User fills form → Click Save
        │
        ▼
┌─ UserModal Component ─┐
│ 1. Validate form      │
│ 2. Call handleSubmit  │
│ 3. userClientService  │
│    .createUser(data)  │
└─────────┬─────────────┘
          │
          ▼
┌─ Client Service ─┐
│ POST /api/users  │ + Authorization header
└─────────┬────────┘
          │
          ▼
┌─ API Route ─┐
│ 1. Auth check│
│ 2. Call ctrl │
└─────────┬───┘
          │
          ▼
┌─ Controller ─┐
│ 1. Validate  │
│ 2. Check dup │
│ 3. Call srv  │
└─────────┬───┘
          │
          ▼
┌─ Service ─┐
│ 1. Gen slug│
│ 2. Create  │
│ 3. Return  │
└─────────┬─┘
          │
          ▼
┌─ MongoDB ─┐
│ Save doc  │
└─────────┬─┘
          │
          ▼
Success ✅ → Toast → Refresh List
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────┐
│   Google OAuth Login             │
│   User clicks "Login with Google"│
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Google Verification              │
│ - User authenticates with Google │
│ - Google returns auth code       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ /api/google/route.ts             │
│ 1. Get auth code from Google     │
│ 2. Call Google API               │
│ 3. Get user info                 │
│ 4. Create/update user in DB      │
│ 5. Generate JWT token            │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ JWT Token Created                │
│ {                                │
│   uid: user._id,                 │
│   email: user.email,             │
│   role: "admin",                 │
│   iat: 1234567890,               │
│   exp: 1234654290 (7 days)       │
│ }                                │
│ Signed with JWT_SECRET           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Frontend Stores Token            │
│ localStorage.setItem('token',..] │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ For Every API Request            │
│ Authorization: Bearer {token}    │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Middleware Verification          │
│ 1. Extract token                 │
│ 2. Verify signature              │
│ 3. Check expiration              │
│ 4. Verify role >= required       │
│ 5. Pass to controller            │
└────────────┬─────────────────────┘
             │
             ▼
   ✅ Authorized / ❌ Rejected
```

---

## 🎯 Role Hierarchy & Authorization

```
┌─────────────────────────────────┐
│      ROLE HIERARCHY             │
├─────────────────────────────────┤
│ Level 3: Super Admin            │
│ ├─ Can delete users             │
│ ├─ Can manage admins            │
│ └─ Can access all routes        │
│                                 │
│ Level 2: Admin                  │
│ ├─ Can create users             │
│ ├─ Can edit users               │
│ ├─ Can list users               │
│ └─ Cannot delete users          │
│                                 │
│ Level 1: User                   │
│ ├─ Can view own profile         │
│ ├─ Can search users             │
│ └─ Cannot manage users          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   ENDPOINT AUTHORIZATION        │
├─────────────────────────────────┤
│ GET  /api/users      → Admin+   │
│ POST /api/users      → Admin+   │
│ PUT  /api/users      → Admin+   │
│ DEL  /api/users      → SuperAdmin
│ GET  /api/users/search → User+  │
│ POST /api/users/filter → User+  │
└─────────────────────────────────┘
```

---

## 📊 Database Schema (MongoDB)

```typescript
// Collection: nguoi_dungs

{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  // Basic Info
  fullName: "John Doe",
  slug: "john-doe",           // Auto-generated from fullName
  email: "john@example.com",
  emailVerified: true,
  
  // Role & Status
  role: "admin",              // enum: user, admin, super_admin
  status: "active",           // enum: active, inactive, banned
  trustScore: 85,             // 0-100
  
  // Media
  avatar: {
    url: "https://...",
    alt: "Avatar"
  },
  
  // Contact
  contact: {
    facebookPrimary: "https://...",
    facebookSecondary: "https://...",
    zalo: "0123456789",
    website: "https://..."
  },
  
  // Insurance
  insurance: {
    amount: 5000000,
    currency: "VND"
  },
  
  // Bank Details
  details: [
    {
      title: "MB Bank",
      content: "1234567890"
    },
    {
      title: "TP Bank",
      content: "0987654321"
    }
  ],
  
  // SEO
  seo: {
    title: "John Doe - Admin",
    description: "Administrator profile",
    keywords: ["admin", "manager"]
  },
  
  // Auth
  auth: {
    provider: "google",
    providerAccountId: "google_123"
  },
  
  // Timestamps
  joinedAt: ISODate("2025-01-01"),
  lastLoginAt: ISODate("2025-01-22"),
  createdAt: ISODate("2025-01-01"),
  updatedAt: ISODate("2025-01-22"),
  
  __v: 0
}
```

---

## 📝 Implementation Guide

### Step 1: Define Model
```typescript
// src/models/user.model.ts
const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: UserRole, default: UserRole.USER },
  // ... other fields
});
```

### Step 2: Create Service
```typescript
// src/services/user.service.ts
export async function getAllUsers(page, limit, filters) {
  const skip = (page - 1) * limit;
  const users = await User.find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  return users;
}
```

### Step 3: Create Controller
```typescript
// src/controllers/user.controller.ts
export async function getUsersController(query) {
  const { page, limit, filters } = query;
  const users = await getAllUsers(page, limit, filters);
  return {
    success: true,
    data: users,
    pagination: { page, limit, total: users.length }
  };
}
```

### Step 4: Create API Route
```typescript
// src/app/api/users/route.ts
export async function GET(request: Request) {
  const token = await authenticateRequest(request, "admin");
  const data = await getUsersController(request.query);
  return Response.json(data);
}
```

### Step 5: Create Client Service
```typescript
// src/services/user.client.ts
export async function getUsers(page, limit) {
  const response = await fetch(`/api/users?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.json();
}
```

### Step 6: Build UI Component
```typescript
// src/app/admin/users/page.tsx
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    userClientService.getUsers(1, 10).then(setUsers);
  }, []);
  
  return <UserTable users={users} />;
}
```

---

## 🚀 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin+ | List users |
| POST | `/api/users` | Admin+ | Create user |
| PUT | `/api/users?id=ID` | Admin+ | Update user |
| DELETE | `/api/users?id=ID` | SuperAdmin | Delete user |
| GET | `/api/users/search` | User+ | Search users |
| POST | `/api/users/filter` | User+ | Filter users |

---

## 🔧 Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# JWT
JWT_SECRET=your_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## ✅ Best Practices

1. **Validation**: Always validate in both controller and frontend
2. **Error Handling**: Use try-catch in services, return meaningful errors
3. **Authorization**: Check role in middleware, not just controller
4. **Pagination**: Always use pagination for list endpoints
5. **Caching**: Cache user list for 5 minutes to reduce DB load
6. **Indexes**: Create indexes on frequently queried fields
7. **Logging**: Log all important operations
8. **Security**: Never send passwords, use HTTPS only

---

## 📚 File References

- **Models**: [user.model.ts](src/models/user.model.ts)
- **Services (Backend)**: [user.service.ts](src/services/user.service.ts)
- **Services (Frontend)**: [user.client.ts](src/services/user.client.ts)
- **Controllers**: [user.controller.ts](src/controllers/user.controller.ts)
- **API Routes**: [app/api/users/route.ts](src/app/api/users/route.ts)
- **Pages**: [app/admin/users/page.tsx](src/app/admin/users/page.tsx)
- **Components**: [UserModal.tsx](src/components/UserModal.tsx)

---

Hệ thống này được thiết kế theo chuẩn MVC production-ready với MongoDB Atlas backend.
