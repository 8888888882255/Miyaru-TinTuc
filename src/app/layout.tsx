import "./globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Miyaru TinTuc - Hệ thống quản lý người dùng",
  description: "Nền tảng quản lý người dùng với xác minh đơn giản và an toàn",
  authors: [{ name: "Miyaru TinTuc" }],
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Miyaru TinTuc",
    description: "Hệ thống quản lý người dùng chuyên nghiệp",
    type: "website",
    images: ["/Logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@miyarutintuc",
    images: ["/Logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
