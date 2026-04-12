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

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="w-full max-w-6xl rounded-[2rem] border border-white/15 bg-slate-950/38 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)] lg:items-start">
            <div className="space-y-6 text-white">
              <div className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.18em] text-white/82 uppercase">
                <Image
                  src="/android-chrome-512x512.png"
                  alt="Mushroom Logo"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border border-white/20 shadow-lg"
                />
                MycoWeekly
              </div>

              <div className="space-y-4">
                <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.34em] text-white/60">
                  Weekly research digest
                </p>
                <h1 className="max-w-3xl font-[family-name:var(--font-space)] text-4xl font-semibold leading-[1.05] text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                  Your Weekly Dose of Mycology Research
                </h1>
                <p className="max-w-2xl font-[family-name:var(--font-figtree)] text-base leading-7 text-white/84 sm:text-lg">
                  Curated mycology papers, distilled for fast reading, with archive access and publication context that keeps the signal clear.
                </p>
              </div>

              <div className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm text-white/80">
                <span>In partnership with</span>
                <Image
                  src="/mms-logo.png"
                  alt="Madison Mycological Society"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-white/15 bg-white/10"
                />
                <span className="font-medium text-white/88">Madison Mycological Society</span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/60">
                    Subscribe free
                  </p>
                  <p className="font-[family-name:var(--font-figtree)] text-base leading-7 text-white/86">
                    Join the weekly roundup for curated research, reliable summaries, and a calmer reading queue.
                  </p>
                </div>

                <div className="space-y-3">
                  <label htmlFor="subscribe-email" className="block text-sm font-semibold text-white">
                    Email address
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      id="subscribe-email"
                      type="email"
                      placeholder="name@example.com"
                      aria-label="Email address"
                      className="min-h-12 flex-1 border-white/15 bg-white/92 text-slate-950 placeholder:text-slate-500"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button
                      onClick={handleSubscribe}
                      disabled={isLoading}
                      className="min-h-12 rounded-full bg-[#8FAF6B] px-6 text-slate-950 shadow-lg shadow-black/20 hover:bg-[#9bbc77]"
                    >
                      {isLoading ? "Subscribing..." : "Subscribe Free"}
                    </Button>
                  </div>
                  <p className="text-sm leading-6 text-white/74">
                    Free weekly roundup. No spam. Unsubscribe anytime.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/85">
                  <p className="text-sm leading-6">
                    <span>Join the other </span>
                    <span className="text-2xl font-semibold text-white">{initialSubscriberCount}</span>
                    <span> mycologists subscribed.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <Card className="h-full rounded-[1.5rem] border-white/12 bg-white/10 p-6 text-left backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/14 hover:shadow-xl hover:shadow-black/20">
                <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/55">
                  Explore
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-figtree)] text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/80 font-body">{feature.description}</p>
              </Card>
            </Link>
          ))}
          </div>
        </section>
      </main>
    </>
  );
}
