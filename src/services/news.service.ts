import { NewsModel } from "@/models/news.model";
import { connectDB } from "@/lib/mongodb";

export async function getDiscoverNews() {
  await connectDB();
  return NewsModel.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(20)
    .populate("author", "fullName slug avatar");
}
