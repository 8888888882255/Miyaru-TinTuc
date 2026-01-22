# 🏗️ System Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  /admin/users (Admin Dashboard Page)                      │  │
│  │  ├── Search Box                                           │  │
│  │  ├── Filter Dialog                                        │  │
│  │  ├── Users Table (with pagination)                        │  │
│  │  ├── User Modal (Add/Edit)                                │  │
│  │  └── Delete Confirmation Dialog                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                   HTTP/HTTPS │ JSON
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS API LAYER (Routes)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Middleware: JWT verification + RBAC                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  API Endpoints                                            │  │
│  │  ├── GET    /api/users           → List users            │  │
│  │  ├── POST   /api/users           → Create user           │  │
│  │  ├── PUT    /api/users?id=ID     → Update user           │  │
│  │  ├── DELETE /api/users?id=ID     → Delete user           │  │
│  │  ├── GET    /api/users/search    → Search users          │  │
│  │  └── POST   /api/users/filter    → Filter users          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          BUSINESS LOGIC LAYER (Controllers)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  user.controller.ts                                       │  │
│  │  ├── createUserController()                               │  │
│  │  ├── getUsersController()                                 │  │
│  │  ├── updateUserController()                               │  │
│  │  ├── deleteUserController()                               │  │
│  │  ├── searchUsersController()                              │  │
│  │  └── filterUsersController()                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│  Handles validation, error handling, response formatting        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│            DATA ACCESS LAYER (Services)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  user.service.ts                                          │  │
│  │  ├── createUser()                                         │  │
│  │  ├── getAllUsers()                                        │  │
│  │  ├── updateUser()                                         │  │
│  │  ├── deleteUser()                                         │  │
│  │  ├── searchUsers()                                        │  │
│  │  ├── filterUsers()                                        │  │
│  │  ├── findUserByEmail()                                    │  │
│  │  └── findUserById()                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│  Direct database queries via Mongoose ORM                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (MongoDB)                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Mongoose Models                                          │  │
│  │  ├── user.model.ts (IUser interface)                      │  │
│  │  └── UserSchema (MongoDB collection)                      │  │
│  ├─ Collections:                                             │  │
│  │  └── nguoi_dungs (users)                                 │  │
│  └─ Indexes:                                                │  │
│     ├── email (unique)                                      │  │
│     ├── slug (unique)                                       │  │
│     ├── role                                                │  │
│     ├── status                                              │  │
│     ├── createdAt                                           │  │
│     └── Full-text search index                              │  │
│                                                             │  │
│  MongoDB Atlas (Cloud Storage)                              │  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Creating a User

```
User clicks "Add User" button
            │
            ▼
UserModal opens
User fills form:
  ├── fullName: "John Doe"
  ├── email: "john@example.com"
  ├── role: "admin"
  ├── status: "active"
  └── ... other fields
            │
            ▼
User clicks "Save"
            │
            ▼
Frontend validation
  ├── Check required fields
  ├── Check email format
  └── Check no empty values
            │
            ▼
API Request:
  POST /api/users
  Headers: {Authorization: "Bearer JWT_TOKEN"}
  Body: {fullName, email, role, ...}
            │
            ▼
Middleware:
  ├── Extract JWT token
  ├── Verify token signature
  ├── Check role >= admin
  └── Pass to controller
            │
            ▼
Controller (createUserController):
  ├── Validate required fields
  ├── Check email not duplicate
  └── Call service
            │
            ▼
Service (createUser):
  ├── Generate slug from fullName
  ├── Check slug uniqueness
  ├── Add timestamps
  ├── Set default values
  └── Insert into MongoDB
            │
            ▼
Mongoose Schema:
  ├── Validate all fields
  ├── Run hooks
  └── Insert document
            │
            ▼
MongoDB:
  Save document to database
            │
            ▼
Response sent back:
  HTTP 201 Created
  Body: {_id, fullName, email, ...}
            │
            ▼
Frontend:
  ├── Show success toast
  ├── Close modal
  ├── Refresh user list
  └── Update table
            │
            ▼
User sees new user in table ✅
```

---

## Data Flow: Searching Users

```
User types in search box: "john"
            │
            ▼
Debounced (300ms delay)
            │
            ▼
API Request:
  GET /api/users/search?q=john&page=1&limit=10
  Headers: {Authorization: "Bearer JWT_TOKEN"}
            │
            ▼
Middleware:
  ├── Verify JWT token
  └── Pass to controller
            │
            ▼
Controller (searchUsersController):
  ├── Validate search term not empty
  └── Call service
            │
            ▼
Service (searchUsers):
  Build MongoDB query:
  {
    $or: [
      { fullName: { $regex: "john", $options: "i" } },
      { email: { $regex: "john", $options: "i" } },
      { slug: { $regex: "john", $options: "i" } }
    ]
  }
            │
            ▼
MongoDB:
  ├── Use text search index
  ├── Find matching documents
  ├── Skip to page 1
  ├── Limit to 10 results
  └── Count total matches
            │
            ▼
Results returned:
  {
    data: [user1, user2, ...],
    pagination: { page: 1, limit: 10, total: 42, pages: 5 }
  }
            │
            ▼
Frontend updates table
            │
            ▼
User sees search results ✅
```

---

## Data Flow: Filtering Users

```
User clicks "Advanced Filters"
            │
            ▼
FilterDialog opens
User selects:
  ├── role: "admin"
  ├── status: "active"
  ├── trustScore: 80-100
  └── joinedAt: 2025-01-01 to 2025-12-31
            │
            ▼
User clicks "Apply Filters"
            │
            ▼
API Request:
  POST /api/users/filter
  Headers: {Authorization: "Bearer JWT_TOKEN"}
  Body: {
    filters: {
      role: "admin",
      status: "active",
      minTrustScore: 80,
      maxTrustScore: 100,
      startDate: "2025-01-01",
      endDate: "2025-12-31"
    },
    page: 1,
    limit: 10
  }
            │
            ▼
Controller (filterUsersController):
  ├── Parse filter dates
  └── Call service
            │
            ▼
Service (filterUsers):
  Build MongoDB query:
  {
    role: "admin",
    status: "active",
    trustScore: { $gte: 80, $lte: 100 },
    joinedAt: {
      $gte: ISODate("2025-01-01"),
      $lte: ISODate("2025-12-31")
    }
  }
            │
            ▼
MongoDB:
  ├── Use role index
  ├── Filter by status
  ├── Filter by trustScore
  ├── Filter by joinedAt
  └── Combine all conditions
            │
            ▼
Results returned with pagination
            │
            ▼
Frontend updates table
            │
            ▼
User sees filtered results ✅
```

---

## Authentication Flow

```
User logs in (via Google OAuth)
            │
            ▼
Google validates credentials
            │
            ▼
Backend creates JWT token:
{
  uid: user._id,
  email: user.email,
  role: "admin",
  iat: 1234567890,
  exp: 1234654290
}
Signed with JWT_SECRET
            │
            ▼
Token sent to frontend
            │
            ▼
Frontend stores token in localStorage
  localStorage.setItem('token', JWT_TOKEN)
            │
            ▼
For each API request:
  ├── Get token from localStorage
  ├── Add to Authorization header
  └── Send: Authorization: Bearer JWT_TOKEN
            │
            ▼
Middleware verifies token:
  ├── Extract token
  ├── Verify signature
  ├── Check expiration
  ├── Verify role
  └── Pass to route handler
            │
            ▼
Route processes request with valid token
            │
            ▼
When token expires (7 days):
  ├── API returns 401 Unauthorized
  ├── Frontend redirects to login
  └── User needs to re-authenticate
```

---

## Role Hierarchy System

```
┌──────────────────────────────────────────────────────────┐
│                    ROLE HIERARCHY                         │
└──────────────────────────────────────────────────────────┘

                   Super Admin (Level 3)
                         │
                         │ Can perform
                         │ Admin actions
                         ▼
                      Admin (Level 2)
                         │
                         │ Can perform
                         │ User actions
                         ▼
                       User (Level 1)


┌──────────────────────────────────────────────────────────┐
│         PERMISSION MATRIX BY ROLE                         │
├──────────────────────────────────────────────────────────┤
│ Action      │ User │ Admin │ Super Admin │                │
├─────────────┼──────┼───────┼─────────────┤                │
│ View own    │  ✅  │  ✅   │     ✅      │                │
│ List all    │  ❌  │  ✅   │     ✅      │                │
│ Create      │  ❌  │  ✅   │     ✅      │                │
│ Update      │ Own  │  ✅   │     ✅      │                │
│ Delete      │  ❌  │  ❌   │     ✅      │                │
│ View admin  │  ❌  │  ✅   │     ✅      │                │
└─────────────┴──────┴───────┴─────────────┘                │
```

---

## Database Schema

```
Collection: nguoi_dungs (Users)

Document Structure:
{
  _id: ObjectId,
  
  // Basic Information
  fullName: String,
  slug: String (unique, auto-generated),
  email: String (unique),
  emailVerified: Boolean,
  
  // Role & Status
  role: String (enum: user, admin, super_admin),
  status: String (enum: active, inactive, banned),
  trustScore: Number (0-100),
  
  // Media
  avatar: {
    url: String,
    alt: String
  },
  
  // Contact Information
  contact: {
    facebookPrimary: String,
    facebookSecondary: String,
    zalo: String,
    website: String
  },
  
  // Insurance
  insurance: {
    amount: Number,
    currency: String (enum: VND, USD)
  },
  
  // Bank Details (Array)
  details: [
    {
      title: String,
      content: String
    }
  ],
  
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  // Authentication
  auth: {
    provider: String (enum: google),
    providerAccountId: String
  },
  
  // Timestamps
  joinedAt: Date,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}


Indexes:
├── { email: 1 } - UNIQUE
├── { slug: 1 } - UNIQUE
├── { role: 1 } - Query
├── { status: 1 } - Query
├── { createdAt: -1 } - Sorting
├── { trustScore: 1 } - Range queries
├── { fullName: "text", email: "text", ... } - Full-text search
└── { role: 1, status: 1, createdAt: -1 } - Compound
```

---

## File Organization Diagram

```
src/
│
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── route.ts          (GET, POST, PUT, DELETE)
│   │       ├── search/
│   │       │   └── route.ts      (GET search)
│   │       └── filter/
│   │           └── route.ts      (POST filter)
│   │
│   └── admin/
│       └── users/
│           └── page.tsx          (Admin dashboard page)
│
├── components/
│   ├── UserModal.tsx             (Add/Edit form)
│   ├── FilterDialog.tsx          (Advanced filters)
│   ├── CustomPagination.tsx      (Pagination)
│   └── ui/                       (Shadcn UI components)
│
├── controllers/
│   └── user.controller.ts        (Business logic)
│
├── services/
│   └── user.service.ts           (Database queries)
│
├── models/
│   ├── user.model.ts             (Mongoose schema)
│   └── enums.ts                  (Type definitions)
│
└── lib/
    ├── auth.ts                   (JWT utilities)
    ├── mongodb.ts                (Database connection)
    └── session.ts                (Session handling)


middleware.ts                      (Route protection + RBAC)
```

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                      │
└────────────────────────────────────────────────────────┘

┌─────────────────┐
│   GitHub Repo   │
│  (Source Code)  │
└────────┬────────┘
         │
         │ git push
         │
         ▼
┌─────────────────┐        ┌──────────────────┐
│    Vercel CI    │───────▶│  Build & Test    │
│                 │        └────────┬─────────┘
│                 │                 │
│  Auto-deploys  │                 ▼
│  on every push │        ┌──────────────────┐
└─────────────────┘        │   Deploy App     │
                           └────────┬─────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         │                                                      │
         ▼                                                      ▼
    ┌─────────────┐                                    ┌──────────────┐
    │ Vercel Edge │                                    │ MongoDB      │
    │ (Frontend)  │◀───────── Connect ─────────────▶  │ Atlas        │
    │             │         via HTTPS                 │ (Database)   │
    │ URL:        │                                    │              │
    │ yourdomain  │                                    │ Connection   │
    │ .vercel.app │                                    │ String:      │
    │             │                                    │ mongodb+srv  │
    └─────────────┘                                    └──────────────┘

Monitoring:
├── Vercel Dashboard (Logs, Metrics, Deployments)
├── MongoDB Atlas Dashboard (Database Stats)
└── Error Tracking (In production)
```

---

## Component Interaction Diagram

```
Admin Dashboard Page
    │
    ├─► SearchBox component
    │   └─► onChange → handleSearch()
    │       └─► API: GET /api/users/search
    │
    ├─► FilterDialog component
    │   └─► onChange → handleApplyFilter()
    │       └─► API: POST /api/users/filter
    │
    ├─► UsersTable component
    │   ├─► Displays user list with pagination
    │   └─► Row Actions dropdown:
    │       ├─► Edit → Opens UserModal
    │       └─► Delete → Opens AlertDialog
    │
    ├─► UserModal component
    │   ├─► For Create: POST /api/users
    │   └─► For Edit: PUT /api/users?id=ID
    │
    ├─► CustomPagination component
    │   └─► onClick page → fetchUsers(page)
    │
    └─► Notifications (Toast)
        ├─► Success messages
        └─► Error messages
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│          Security Architecture              │
└─────────────────────────────────────────────┘

Layer 1: HTTPS/TLS (Vercel Auto-SSL)
   └─► All traffic encrypted

Layer 2: Authentication (JWT)
   └─► Token-based auth
   └─► Token stored in localStorage
   └─► Token verification in middleware

Layer 3: Authorization (RBAC)
   └─► Route protection
   └─► Role-based access checks
   └─► API endpoint authorization

Layer 4: Input Validation
   └─► Required field checks
   └─► Email format validation
   └─► Data type validation
   └─► XSS prevention

Layer 5: Database Security
   └─► Unique constraints (email, slug)
   └─► Parameterized queries (Mongoose)
   └─► SQL injection prevention

Layer 6: Secrets Management
   └─► JWT_SECRET in env variables
   └─► MongoDB credentials in env
   └─► No hardcoded credentials
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable component structure
- ✅ Secure data flow
- ✅ Production-ready deployment
- ✅ Easy to understand and maintain

For implementation details, see the source code files.
