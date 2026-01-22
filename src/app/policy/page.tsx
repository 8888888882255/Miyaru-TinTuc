"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

interface Settings {
  site: {
    name: string;
  };
  policies: {
    privacyPolicy: {
      title: string;
      content: string[];
    };
    termsOfService: {
      title: string;
      content: string[];
    };
  };
}

export default function Policy() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/settings.json");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left animate-fade-in">
            Chính sách & Điều khoản - {settings?.site.name || "AdminMmo"}
          </h1>

          <div className="space-y-8">
            {/* Privacy Policy */}
            <Card className="animate-slide-up">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">1. {settings.policies.privacyPolicy.title}</h2>
                <div className="space-y-4 text-muted-foreground text-sm md:text-base">
                  {settings.policies.privacyPolicy.content.map((paragraph, index) => (
                    <p key={index} className={paragraph.startsWith("-") ? "ml-4" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Terms of Service */}
            <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">2. {settings.policies.termsOfService.title}</h2>
                <div className="space-y-4 text-muted-foreground text-sm md:text-base">
                  {settings.policies.termsOfService.content.map((paragraph, index) => (
                    <p key={index} className={paragraph.startsWith("-") ? "ml-4" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
