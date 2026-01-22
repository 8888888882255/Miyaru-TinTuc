"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, CheckCircle2, TrendingUp } from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Settings {
  site: {
    name: string;
  };
  about: {
    hero: {
      title: string;
      description: string;
    };
    mission: {
      title: string;
      description: string;
    };
    features: Feature[];
    howItWorksTitle: string;
    steps: Array<{
      step: number;
      title: string;
      description: string;
    }>;
    communityGuidelines: string[];
  };
}

const iconMap: { [key: string]: any } = {
  Shield,
  Users,
  CheckCircle2,
  TrendingUp,
};

export default function About() {
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

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              {settings.about.hero.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground animate-slide-up leading-relaxed">
              {settings.about.hero.description}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">{settings.about.mission.title}</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {settings.about.mission.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6">
              {settings.about.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Shield;
                return (
                  <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center md:text-left">{settings.about.howItWorksTitle}</h2>
            <div className="space-y-6">
              {settings.about.steps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 text-white font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
              Quy tắc cộng đồng {settings?.site.name || "AdminMmo"}
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm">
              {settings.about.communityGuidelines.map((guideline, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p>{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
