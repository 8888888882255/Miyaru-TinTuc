import { NextResponse } from "next/server";
import { getDiscoverNews } from "@/services/news.service";
import { cacheGet, cacheSet } from "@/lib/cache";

export const revalidate = 60;

export async function GET() {
  const cached = cacheGet("discover_news");
  if (cached) return NextResponse.json(cached);

  const news = await getDiscoverNews();
  cacheSet("discover_news", news, 120);

  return NextResponse.json(news);
}
