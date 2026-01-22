# Hướng dẫn Setup MongoDB Atlas & Vercel Deployment

## I. MongoDB Atlas Setup

### Bước 1: Tạo MongoDB Atlas Account
1. Truy cập [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start free" hoặc đăng nhập nếu đã có account
3. Tạo Organization và Project

### Bước 2: Tạo Cluster
1. Click "Create Cluster"
2. Chọn "Free" tier
3. Chọn Cloud Provider (AWS, Google Cloud, Azure)
4. Chọn Region gần nhất (ví dụ: ap-southeast-1 cho Việt Nam)
5. Click "Create Cluster" (chờ 1-3 phút)

### Bước 3: Tạo Database User
1. Vào tab "Security" → "Database Access"
2. Click "Add New Database User"
3. Nhập:
   - Username: `miyaru_user` (hoặc tên khác)
   - Password: Tạo password mạnh (ghi nhớ hoặc lưu)
   - Built-in Role: `Atlas admin`
4. Click "Add User"

### Bước 4: Whitelist IP Address
1. Vào tab "Security" → "Network Access"
2. Click "Add IP Address"
3. Chọn "Allow Access from Anywhere" (0.0.0.0/0) cho development
   - **Lưu ý**: Sau này đổi thành IP cụ thể cho production
4. Click "Confirm"

### Bước 5: Lấy Connection String
1. Vào "Clusters" tab
2. Click "Connect" button của cluster
3. Chọn "Drivers"
4. Chọn "Node.js" driver
5. Copy connection string, ví dụ:
```
mongodb+srv://miyaru_user:<password>@miyaru-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Bước 6: Cập nhật .env.local
```env
MONGODB_URI=mongodb+srv://miyaru_user:<YOUR_PASSWORD>@miyaru-cluster.xxxxx.mongodb.net/miyaru_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_32_chars_minimum_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Bước 7: Tạo Database trong MongoDB Atlas
1. Vào "Clusters" → "Collections"
2. Click "Create Database"
3. Database Name: `miyaru_db`
4. Collection Name: `nguoi_dungs` (tên collection cho users)
5. Click "Create"

## II. Vercel Deployment Setup

### Bước 1: Chuẩn bị Repository
1. Khởi tạo Git (nếu chưa):
```bash
git init
git add .
git commit -m "Initial commit - User Management System"
```

2. Push lên GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Bước 2: Vercel Account Setup
1. Truy cập [https://vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Đăng nhập bằng GitHub account
4. Click "Authorize Vercel"

### Bước 3: Import Project
1. Vào dashboard Vercel
2. Click "Add New..." → "Project"
3. Chọn GitHub repository của bạn
4. Click "Import"

### Bước 4: Configure Environment Variables
1. Trong Import dialog, tìm phần "Environment Variables"
2. Thêm các biến:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key cho JWT
   - `GOOGLE_CLIENT_ID`: Google OAuth ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth Secret
   - `NEXT_PUBLIC_API_URL`: https://your-vercel-domain.vercel.app

3. Click "Deploy"

### Bước 5: Chờ deployment hoàn tất
- Vercel sẽ tự động build và deploy
- Xem logs trong tab "Deployments"
- Khi hoàn tất, bạn sẽ nhận được production URL

## III. Cấu hình Database Indexes (Tối ưu hiệu suất)

Sau khi deploy, tạo indexes trong MongoDB:

```javascript
db.nguoi_dungs.createIndex({ email: 1 }, { unique: true })
db.nguoi_dungs.createIndex({ slug: 1 }, { unique: true })
db.nguoi_dungs.createIndex({ role: 1 })
db.nguoi_dungs.createIndex({ status: 1 })
db.nguoi_dungs.createIndex({ createdAt: -1 })
db.nguoi_dungs.createIndex({
  fullName: "text",
  "seo.title": "text",
  "seo.description": "text",
  "seo.keywords": "text"
})
```

Thực hiện trong MongoDB Atlas:
1. Vào Collections
2. Click tên collection
3. Vào tab "Indexes"
4. Click "Create Index"
5. Paste các index definitions

## IV. Testing Deployment

### Test API Endpoints
```bash
# Test lấy danh sách users
curl -X GET "https://your-vercel-domain.vercel.app/api/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test tạo user
curl -X POST "https://your-vercel-domain.vercel.app/api/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }'
```

## V. Troubleshooting

### Lỗi: MongoDB Connection Error
- Kiểm tra MONGODB_URI đúng
- Kiểm tra IP whitelist trong MongoDB Atlas
- Kiểm tra database user credentials

### Lỗi: JWT Secret not found
- Đảm bảo JWT_SECRET được set trong Vercel environment variables
- Không bao gồm JWT_SECRET trong public files

### Lỗi: API timeout
- Kiểm tra database query performance
- Thêm indexes nếu cần
- Kiểm tra Vercel function timeout (15 seconds limit)

### Lỗi: CORS issues
- Thêm CORS headers trong API routes nếu cần
- Cập nhật NEXT_PUBLIC_API_URL

## VI. Các dòng lệnh hữu ích

```bash
# Local development
npm install
npm run dev

# Build local
npm run build

# Test production build
npm run start

# Check environment variables
echo $MONGODB_URI
```

## VII. Security Checklist

- ✅ JWT_SECRET được set và bí mật
- ✅ Database user có minimal permissions cần thiết
- ✅ IP whitelist chỉ cho Vercel IPs (khi production)
- ✅ Không commit .env.local lên GitHub
- ✅ Enable HTTPS (tự động với Vercel)
- ✅ Cập nhật dependencies thường xuyên
- ✅ Rotate JWT_SECRET định kỳ

## VIII. Scaling Tips

Khi traffic tăng:
1. Upgrade MongoDB Atlas cluster (từ Shared sang Dedicated)
2. Enable MongoDB Atlas Auto-scaling
3. Setup database replicas
4. Implement caching (Redis)
5. Optimize queries với appropriate indexes
6. Setup monitoring với Vercel Analytics

---

Sau khi hoàn tất tất cả bước, bạn sẽ có:
- ✅ MongoDB Atlas database được cấu hình
- ✅ Ứng dụng deployed trên Vercel
- ✅ Auto-scaling và monitoring
- ✅ Secure environment variables
