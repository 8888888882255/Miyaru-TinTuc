// src/models/user.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole, UserStatus, Currency, AuthProvider } from "./enums";

export interface IUser extends Document {
  fullName: string;
  slug: string;

  email: string;
  emailVerified: boolean;

  role: UserRole;
  trustScore: number;

  avatar: {
    url: string;
    alt: string;
  };

  status: UserStatus;

  joinedAt: Date;
  lastLoginAt?: Date;

  auth: {
    provider: AuthProvider;
    providerAccountId: string;
  };

  contact: {
    facebookPrimary?: string;
    facebookSecondary?: string;
    zalo?: string;
    website?: string;
  };

  insurance: {
    amount: number;
    currency: Currency;
  };

  details: {
    title: string;
    content: string;
  }[];

  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },

    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      index: true,
    },

    trustScore: { type: Number, default: 0, min: 0, max: 100 },

    avatar: {
      url: { type: String },
      alt: { type: String },
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true,
    },

    joinedAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },

    auth: {
      provider: {
        type: String,
        enum: Object.values(AuthProvider),
        required: true,
      },
      providerAccountId: { type: String, required: true },
    },

    contact: {
      facebookPrimary: String,
      facebookSecondary: String,
      zalo: String,
      website: String,
    },

    insurance: {
      amount: { type: Number, default: 0 },
      currency: {
        type: String,
        enum: Object.values(Currency),
        default: Currency.VND,
      },
    },

    details: [
      {
        title: String,
        content: String,
      },
    ],

    seo: {
      title: { type: String, index: "text" },
      description: { type: String },
      keywords: [{ type: String }],
    },
  },
  {
    timestamps: true,
    collection: "nguoi_dungs",
  }
);

// SEO + Discover
UserSchema.index({
  fullName: "text",
  "seo.title": "text",
  "seo.description": "text",
  "seo.keywords": "text",
});

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export { UserModel as User };
export default UserModel;
