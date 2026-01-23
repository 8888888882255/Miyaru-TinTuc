# 🛡️ AdminMmo - Reputation Verification & Lookup System

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**AdminMmo** (Miyaru News) is a platform that helps the community look up, verify the identity and check the reputation of Administrators (Admins) or Transaction Intermediaries. The system helps reduce the risk of fraud through transparency of contact information and insurance funds.

## ✨ Main Features

- 🔍 **Smart lookup:** Search for Admin by Name, Phone Number, Bank Number or Zalo.
- 👤 **Transparent profile:** Displays detailed contact information and official social network accounts.
- 🏦 **Insurance Fund:** Displays the insurance amount (Insurance Fund) to ensure transaction safety.
- 📊 **System statistics:** Dashboard overview of the number of Admins, total insurance fund and cash flow.
- 🌙 **Modern interface:** Supports Dark Mode/Light Mode, optimizes user experience (UX/UI) with Shadcn UI.
- 🗄️ **Powerful database:** Use MongoDB for high-speed data storage and retrieval.

## 🛠 Technology Used

| Classification | Technology |
| :--- | :--- |
| **Core** | [Next.js 15 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose ODM](https://mongoosejs.com/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **State & Fetching** | React Query (@tanstack/react-query), React Hook Form |
| **Validation** | Zod |

## 🚀 Installation & Deployment Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.17+ or 20+ recommended).
- [MongoDB Atlas] account (https://www.mongodb.com/cloud/atlas) (or locally installed MongoDB).

### 2. Install source code

```bash
# Clone project
git clone https://github.com/your-username/miyaru-tintuc.git

# Move into directory
cd miyaru-tintuc

# Install dependent packages
npm install
```

### 3. Environment Configuration

Create `.env.local` file in the root directory and configure the Database connection string:

```env
# .env.local
# Replace user, pass and db_name with your information
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/MiyaruDB?retryWrites=true&w=majority
```

> ⚠️ **Important:** Make sure you add the database name (e.g. `/MiyaruDB`) to the connection string to avoid data being saved to the default `test` database.

### 4. Load sample data (Database Seeding)

The project supports converting data from static JSON files to MongoDB.
1. Run the development server: `npm run dev`
2. Open a browser and access: `http://localhost:3000/api/seed`
3. Wait to receive notification: `{"message": "Seeded X users successfully"}`

### 5. Launch

**Development Environment:**
```bash
npm run dev
# Access: http://localhost:3000
```

**Production Environment:**
```bash
npm run build
npm run start
```

## 📂 Project Structure

```bash
├── public/ # Static resources (Images, original JSON...)
├── src/
│ ├── app/ # Next.js App Router (Pages & API)
│ │ ├── admin/ # Admin page
│ │ ├── api/ # API Endpoints (Users, Seed)
│ │ └── [slug]/ # User details page
│ ├── components/ # React Components (UI, Layouts)
│ ├── lib/ # System configuration (DB Connect, Utils)
│ ├── models/ # Mongoose Models (Schemas)
│ ├── types/ # TypeScript Definitions
│ └── hooks/ # Custom React Hooks
├── .env.local # Environment variable (Do not commit this file)
└── package.json # Declare dependencies
```

## 🤝 Contributing

We always welcome any contributions! Please follow these steps:

1. Fork the project.
2. Create a new feature branch (`git checkout -b feature/TinhNangMoi`).
3. Commit your changes (`git commit -m 'Add feature X'`).
4. Push to branch (`git push origin feature/TinhNangMoi`).
5. Create a new Pull Request.

## 📄 Copyright

The project is owned by **Miyaru Team**.

---
*Developed with ❤️ and ☕.*