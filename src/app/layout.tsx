import "./globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AdminMmo - Cộng đồng AdminMmo Việt Nam",
  description: "Nền tảng cộng đồng giúp bạn tìm kiếm và xác minh các AdminMmo trực tuyến tại Việt Nam",
  authors: [{ name: "AdminMmo" }],
  openGraph: {
    title: "AdminMmo - Cộng đồng AdminMmo Việt Nam",
    description: "Nền tảng cộng đồng giúp bạn tìm kiếm và xác minh các AdminMmo trực tuyến",
    type: "website",
    images: ["/Logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@checkscamvn",
    images: ["/Logo.jpg"],
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
