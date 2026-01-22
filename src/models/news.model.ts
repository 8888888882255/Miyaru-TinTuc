import mongoose, { Schema } from "mongoose";

const NewsSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true, index: true },
    description: String,
    content: String,

    thumbnail: {
      url: String,
      alt: String,
    },

    author: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
    status: { type: String, default: "published" },

    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true, collection: "news" }
);

export const NewsModel =
  mongoose.models.News || mongoose.model("News", NewsSchema);
