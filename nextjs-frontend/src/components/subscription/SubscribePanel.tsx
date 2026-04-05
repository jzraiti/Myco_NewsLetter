"use client";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { subscribeRecipient } from "@/lib/public-data/subscriptions";

type SubscribePanelProps = {
  initialSubscriberCount: number;
  backgroundImage: string;
  preloadImages: readonly string[];
};

export function SubscribePanel({
  initialSubscriberCount,
  backgroundImage,
  preloadImages,
}: SubscribePanelProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  }>({ show: false, message: "", variant: "success" });

  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((previous) => ({ ...previous, show: false })), 3000);
  };

  const handleSubscribe = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    const result = await subscribeRecipient(email);

    showToast(result.message, result.status === "subscribed" ? "success" : "error");

    if (result.status === "subscribed") {
      setEmail("");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        {preloadImages.map((src) => (
          <link key={src} rel="preload" as="image" href={src} />
        ))}
      </Head>

      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast((previous) => ({ ...previous, show: false }))}
        variant={toast.variant}
      />

      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">
        <p className="font-bold flex items-center gap-2 text-3xl text-white drop-shadow-lg">
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={60}
            height={60}
            className="w-15 h-15 drop-shadow-lg rounded-full"
          />
          Mycoweekly
        </p>
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg font-display leading-tight">
          Your Weekly Dose of Mycology Research
        </h1>
        <p className="font-bold flex items-center gap-2 text-1xl text-white drop-shadow-lg">
          In partnership with
          <Image
            src="/mms-logo.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-15 h-15 drop-shadow-lg rounded-full"
          />
        </p>
        <div className="w-full max-w-md flex gap-2 p-2 rounded-lg backdrop-blur-md bg-white/10">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white/90 placeholder:text-gray-500"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
          {[
            {
              title: "Weekly Updates",
              description: "The latest papers delivered to your inbox",
              href: "/newsletters",
            },
            {
              title: "Curated Content",
              description: "Selected articles from only the highest JUFO rated journals",
              href: "/jufo",
            },
            {
              title: "Article Summaries",
              description: "Concise, readable research breakdowns for quick reference",
              href: "/articles",
            },
          ].map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md bg-white/20">
                <h3 className="font-semibold mb-2 font-display text-white">{feature.title}</h3>
                <p className="text-sm text-white font-body">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center px-6 py-3 rounded-lg">
          <p className="text-white">
            <span>Join the other </span>
            <span className="font-bold text-xl">{initialSubscriberCount}</span>
            <span> mycologists subscribed!</span>
          </p>
        </div>
      </main>
    </>
  );
}
