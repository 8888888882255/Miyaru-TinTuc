# Admin Users Management - User Guide

## 📖 Table of Contents
1. [Accessing Admin Panel](#accessing-admin-panel)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Users](#managing-users)
4. [Search & Filter](#search--filter)
5. [User Details](#user-details)
6. [Bulk Operations](#bulk-operations)
7. [Troubleshooting](#troubleshooting)

---

## 🔓 Accessing Admin Panel

### Requirements
- Admin hoặc Super Admin role
- Valid JWT token
- Access to `/admin/users` route

### Steps
1. Đăng nhập với Google account
2. Nhận JWT token
3. Truy cập: `http://localhost:3000/admin/users`
4. Dashboard sẽ load danh sách users

**Lưu ý**: Nếu không có quyền, bạn sẽ bị redirect về homepage.

---

## 📊 Dashboard Overview

### Giao diện chính
```
┌─────────────────────────────────────────────────────────────┐
│  Users Management                          [+ Add User]     │
├─────────────────────────────────────────────────────────────┤
│  Search box        [Advanced Filters]  [Clear Filters (0)]  │
├─────────────────────────────────────────────────────────────┤
│  Users List                                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Name  │ Email │ Role │ Status │ Score │ Joined │ Actions││
│  ├─────────────────────────────────────────────────────────┤│
│  │ John  │ ...   │ Admin│ Active │ 85%   │ 1/22   │ ⋮     ││
│  │ Jane  │ ...   │ User │ Active │ 92%   │ 1/15   │ ⋮     ││
│  │ ...   │ ...   │ ...  │ ...    │ ...   │ ...    │ ...   ││
│  └─────────────────────────────────────────────────────────┘│
│                      [< 1 2 3 4 5 >]                         │
└─────────────────────────────────────────────────────────────┘
```

### Thành phần chính

#### 1. **Header**
- Tiêu đề: "Users Management"
- Nút "Add User" để thêm user mới

#### 2. **Search & Filter Bar**
- **Search Box**: Tìm kiếm theo tên, email hoặc slug
- **Advanced Filters**: Mở dialog lọc nâng cao
- **Clear Filters**: Xóa tất cả filters được áp dụng

#### 3. **Users Table**
Hiển thị danh sách users với các cột:
- **Name**: Tên đầy đủ của user
- **Email**: Email address
- **Role**: user, admin, hoặc super_admin (badge có màu)
- **Status**: active, inactive, hoặc banned (badge có màu)
- **Trust Score**: Progress bar 0-100%
- **Joined**: Ngày tham gia (MM/DD)
- **Actions**: Dropdown menu (Edit, Delete)

#### 4. **Pagination**
- Hiển thị trang hiện tại và tổng số trang
- Nút Previous/Next để điều hướng
- Click số trang để chuyển trực tiếp

---

## 👥 Managing Users

### Thêm User Mới

**Cách 1: Click nút "Add User"**
1. Click "[+ Add User]" button ở header
2. Popup "Add New User" sẽ mở
3. Điền các trường bắt buộc (*)
4. Click "Save"

**Form Fields:**

**Basic Information**
- **Full Name *** (bắt buộc): Họ và tên user
- **Email *** (bắt buộc): Email address (phải unique)
- **Role**: Chọn user, admin, hoặc super_admin
- **Status**: Chọn active, inactive, hoặc banned
- **Trust Score**: Nhập số từ 0-100

**Avatar**
- **Avatar URL**: Link ảnh đại diện
- **Avatar Alt Text**: Mô tả thay thế cho ảnh

**Contact Information**
- **Facebook Primary**: Link Facebook chính
- **Facebook Secondary**: Link Facebook dự phòng
- **Zalo**: Số điện thoại Zalo
- **Website**: Website cá nhân

**Insurance**
- **Amount**: Số tiền bảo hiểm
- **Currency**: Đơn vị (VND hoặc USD)

**Bank Details**
- Click "[Add Detail]" để thêm thông tin ngân hàng
- Nhập: Title (e.g., "MB Bank") và Content (e.g., số tài khoản)
- Click "Remove" để xóa chi tiết

**SEO**
- **Title**: Tiêu đề SEO
- **Description**: Mô tả SEO
- **Keywords**: Từ khóa (cách nhau bằng dấu phẩy)

**Hành động**
- Click "Save" để lưu user mới
- Click "Cancel" để hủy

### Sửa User

**Cách 1: Click menu Actions**
1. Tìm user trong danh sách
2. Click biểu tượng "⋮" (three dots) ở cuối hàng
3. Chọn "Edit"
4. Popup "Edit User" mở
5. Sửa các trường cần thiết
6. Click "Save"

**Cách 2: Click trực tiếp vào hàng**
- Có thể click vào tên user (tùy implement)

**Lưu ý**:
- Chỉ Admin+ mới có thể sửa user
- Sửa fullName sẽ tự động cập nhật slug
- Email không thể trùng với user khác

### Xóa User

⚠️ **Chỉ Super Admin mới có thể xóa user!**

**Cách xóa:**
1. Click biểu tượng "⋮" ở hàng user
2. Chọn "Delete"
3. Confirm dialog sẽ hiện
4. Click "Delete" để xác nhận

**Cảnh báo:**
```
⚠️ Are you sure you want to delete [Name]?
This action cannot be undone.
```

---

## 🔍 Search & Filter

### Tìm kiếm (Search)

**Cách sử dụng:**
1. Nhập từ khóa vào Search box
2. Tìm kiếm sẽ tự động khi bạn gõ (debounced)
3. Kết quả sẽ lọc theo: tên, email, hoặc slug

**Ví dụ:**
```
Search "john" → Tìm tất cả users có chứa "john" 
               trong tên, email, hoặc slug
```

### Lọc nâng cao (Advanced Filters)

Click "[Advanced Filters]" button để mở dialog lọc.

**Filter Options:**

1. **Role Filter**
   - User (mặc định)
   - Admin
   - Super Admin

2. **Status Filter**
   - Active (mặc định)
   - Inactive
   - Banned

3. **Trust Score Range**
   - Min slider: 0-100
   - Max slider: 0-100
   - Ví dụ: Min 70, Max 100 → Chỉ user có score 70-100

4. **Joined Date Range**
   - From: Chọn ngày bắt đầu
   - To: Chọn ngày kết thúc

**Cách áp dụng:**
1. Chọn các filter cần thiết
2. Click "[Apply Filters]"
3. Danh sách sẽ được cập nhật

**Cách xóa filters:**
1. Click nút "[Clear Filters (n)]" ở search bar
2. Hoặc click "[Reset]" trong dialog và reopen

### Kết hợp Search & Filter

Bạn có thể dùng Search + Advanced Filters cùng lúc:
```
Ví dụ:
- Search: "john"
- Filter: Role = Admin, Status = Active, Trust Score ≥ 80
→ Kết quả: Tất cả admin users tên có "john", active, score ≥80
```

---

## 📋 User Details

### Xem thông tin user

Click vào hàng user hoặc click Edit để xem chi tiết đầy đủ.

### Badge Colors

**Role Badge:**
- 🔴 **Super Admin** (Red)
- 🔵 **Admin** (Blue)
- ⚫ **User** (Gray)

**Status Badge:**
- 🟢 **Active** (Green) - User hoạt động
- 🟡 **Inactive** (Yellow) - User không hoạt động
- 🔴 **Banned** (Red) - User bị cấm

**Trust Score:**
- Progress bar hiển thị % (0-100)
- Màu xanh biểu thị độ tin cậy

### Export User Information

Tạo JSON từ user:
```javascript
// Sử dụng console trong browser
const userData = {
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin",
  // ...
};

// Copy JSON
JSON.stringify(userData, null, 2)
```

---

## 📊 Bulk Operations

**Tính năng sắp có (Roadmap):**
- [ ] Select multiple users
- [ ] Bulk delete
- [ ] Bulk status update
- [ ] Bulk role change
- [ ] Export as CSV/PDF

**Hiện tại:** Chỉ có thể sửa/xóa từng user một.

---

## ⚙️ Advanced Features

### Auto-generated Fields

**Slug Field:**
- Tự động sinh từ Full Name
- Format: `john-doe` (lowercase, no spaces)
- Unique trong database
- Không thể chỉnh sửa trực tiếp

**Timestamps:**
- **createdAt**: Tự động khi tạo
- **updatedAt**: Tự động khi update
- **joinedAt**: Tự động set bằng current date
- **lastLoginAt**: Update khi user login

### Pagination Settings

**Mặc định:**
- 10 items per page
- Có thể thay đổi trong code (pageSize variable)

**Các trang hiển thị:**
- Tối đa 5 buttons của trang
- "..." nếu có nhiều trang
- Nút Previous/Next

---

## 🐛 Troubleshooting

### Không thể tải danh sách users

**Nguyên nhân:**
1. JWT token hết hạn
2. Không có quyền (role < admin)
3. Database connection error

**Giải pháp:**
1. Đăng nhập lại để lấy token mới
2. Kiểm tra localStorage: `localStorage.getItem('token')`
3. Kiểm tra console: `F12 → Console`
4. Kiểm tra Vercel logs nếu deployed

### Tìm kiếm không hoạt động

**Nguyên nhân:**
1. Search term rỗng
2. Database indexes chưa được tạo
3. Connection timeout

**Giải pháp:**
```bash
# Tạo text search index
db.nguoi_dungs.createIndex({
  fullName: "text",
  "seo.title": "text",
  "seo.description": "text"
})
```

### Filter không trả kết quả

**Nguyên nhân:**
1. Filter quá strict (không user nào match)
2. Database query timeout

**Giải pháp:**
- Thử reset filters
- Kiểm tra data có tồn tại không
- Giảm number of filters

### Modal không save

**Nguyên nhân:**
1. Validation error (xem error message)
2. Email duplicate
3. Network error

**Giải pháp:**
- Kiểm tra red error message
- Kiểm tra email là unique
- Thử refresh page

### Pagination page không load

**Nguyên nhân:**
1. Page number quá lớn
2. Database error

**Giải pháp:**
- Click "Clear Filters" để reset
- Quay lại page 1
- Refresh trang

---

## 🔒 Permission Matrix

| Action | User | Admin | Super Admin |
|--------|------|-------|-------------|
| View own info | ✅ | ✅ | ✅ |
| List all users | ❌ | ✅ | ✅ |
| Add user | ❌ | ✅ | ✅ |
| Edit user | Own only | ✅ | ✅ |
| Delete user | ❌ | ❌ | ✅ |
| Change role | ❌ | ❌ | ✅ |
| View admin page | ❌ | ✅ | ✅ |

---

## 📱 Keyboard Shortcuts

**Sắp implement:**
- Ctrl+K: Open command palette
- Ctrl+F: Focus search box
- Escape: Close modals
- Enter: Submit form

---

## 💾 Data Export

**CSV Export (Sắp có):**
```bash
# Download users as CSV
GET /api/users/export?format=csv
```

**PDF Export (Sắp có):**
```bash
# Download users as PDF
GET /api/users/export?format=pdf
```

---

## 📚 Related Documentation

- [README_USER_MANAGEMENT.md](./README_USER_MANAGEMENT.md) - Technical overview
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - API reference
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment steps

---

## 🆘 Need Help?

1. **Check logs**: Browser console (F12)
2. **Review error message**: Popup sẽ hiển thị lỗi
3. **Check docs**: Xem tài liệu liên quan
4. **Restart app**: Refresh page hoặc restart dev server
5. **Check database**: Verify MongoDB connection

---

**Last Updated**: January 2026  
**Version**: 1.0.0
