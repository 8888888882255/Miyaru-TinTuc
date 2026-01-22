import "./globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";

async function getSettings() {
  try {
    const response = await fetch(new URL("/settings.json", "http://localhost:3000"), {
      cache: "no-store",
    });
    return await response.json();
  } catch {
    return null;
  }
}

const settings = {
  site: {
    name: "AdminMmo",
  },
};

export const metadata: Metadata = {
  title: `${settings.site.name} - Cộng đồng ${settings.site.name} Việt Nam`,
  description: `Nền tảng cộng đồng giúp bạn tìm kiếm và xác minh các ${settings.site.name} trực tuyến tại Việt Nam`,
  authors: [{ name: settings.site.name }],
  icons: {
    icon: "https://sf-static.upanhlaylink.com/img/image_20251020f246f5eea31ab26ae21a6f3851697462.jpg",
  },
  openGraph: {
    title: `${settings.site.name} - Cộng đồng ${settings.site.name} Việt Nam`,
    description: `Nền tảng cộng đồng giúp bạn tìm kiếm và xác minh các ${settings.site.name} trực tuyến`,
    type: "website",
    images: ["https://sf-static.upanhlaylink.com/img/image_20251020f246f5eea31ab26ae21a6f3851697462.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@checkscamvn",
    images: ["https://sf-static.upanhlaylink.com/img/image_20251020f246f5eea31ab26ae21a6f3851697462.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="https://sf-static.upanhlaylink.com/img/image_20251020f246f5eea31ab26ae21a6f3851697462.jpg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
