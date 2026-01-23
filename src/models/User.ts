import mongoose, { Schema, Document, Model } from "mongoose";
import { User as UserType, UserAvatar, UserAuth, UserContact, UserInsurance, UserDetail, UserSEO } from "@/types/user";

// Define sub-schemas
const UserAvatarSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String, default: "" },
}, { _id: false });

const UserAuthSchema = new Schema({
  provider: { type: String, required: true },
  providerAccountId: { type: String },
}, { _id: false });

const UserContactSchema = new Schema({
  facebookPrimary: { type: String },
  facebookSecondary: { type: String },
  zalo: { type: String },
  website: { type: String },
}, { _id: false });

const UserInsuranceSchema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
}, { _id: false });

const UserDetailSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { _id: false });

const UserSEOSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String }],
}, { _id: false });

// Main User Schema
const UserSchema = new Schema({
  fullName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String },
  emailVerified: { type: Boolean, default: false },
  role: { 
    type: String, 
    enum: ["admin", "super_admin", "user"], 
    default: "user" 
  },
  trustScore: { type: Number, default: 0 },
  
  // Mixed type to support both string (legacy) and object
  avatar: { 
    type: Schema.Types.Mixed,
    validate: {
      validator: function(v: unknown) {
        return typeof v === 'string' || (typeof v === 'object' && v !== null && 'url' in v);
      },
      message: (props: { value: unknown }) => `${props.value} is not a valid avatar format!`
    }
  },
  
  status: { 
    type: String, 
    enum: ["active", "inactive"], 
    default: "active" 
  },
  
  joinedAt: { type: Date },
  lastLoginAt: { type: Date },
  
  auth: UserAuthSchema,
  contact: UserContactSchema,
  insurance: UserInsuranceSchema,
  details: [UserDetailSchema],
  seo: UserSEOSchema,

  // Legacy fields
  name: { type: String },
  soTaiKhoan: { type: String },
  nganHang: { type: String },
  ngayThamGia: { type: String },
  facebook: { type: Schema.Types.Mixed },
  zalo: { type: String },
  web: { type: String },
  baoHiem: { type: Schema.Types.Mixed },
  dichVu: [{ type: String }],
  chuTaiKhoan: { type: String },
  stkKhac: [{ type: Schema.Types.Mixed }],

}, { 
  timestamps: true, // handles createdAt and updatedAt
  strict: false // Allow other fields if necessary during migration
});

// Create model
// We need to use "mongoose.models" to check if the model is already compiled
// to avoid "OverwriteModelError" in Next.js development mode.
const User = (mongoose.models.User as Model<Document & UserType>) || mongoose.model<Document & UserType>("User", UserSchema);

export default User;
