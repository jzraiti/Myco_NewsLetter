"use client";

import Image from "next/image";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { unsubscribeRecipient } from "@/lib/public-data/subscriptions";

export function UnsubscribePanel() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  }>({ show: false, message: "", variant: "success" });

  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((previous) => ({ ...previous, show: false })), 3000);
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    const result = await unsubscribeRecipient(email);

    showToast(result.message, result.status === "unsubscribed" ? "success" : "error");

    if (result.status === "unsubscribed") {
      setEmail("");
    }

    setIsConfirming(false);
    setIsLoading(false);
  };

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast((previous) => ({ ...previous, show: false }))}
        variant={toast.variant}
      />

      <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="w-full max-w-3xl rounded-[2rem] border border-white/15 bg-slate-950/40 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="space-y-6 text-white">
            <div className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.18em] uppercase text-white/82">
              <Image
                src="/android-chrome-512x512.png"
                alt="Mushroom Logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full border border-white/20 shadow-lg"
              />
              MycoWeekly
            </div>

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.32em] text-white/58">
                Subscription settings
              </p>
              <h1 className="font-[family-name:var(--font-space)] text-4xl font-semibold leading-tight text-white sm:text-5xl">
                We are sad to see you go.
              </h1>
              <p className="max-w-2xl font-[family-name:var(--font-figtree)] text-base leading-7 text-white/82">
                Review the address below before removing it from the weekly research digest.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="unsubscribe-email" className="block text-sm font-semibold text-white">
                    Email address
                  </label>
                  <Input
                    id="unsubscribe-email"
                    type="email"
                    placeholder="name@example.com"
                    aria-label="Email address"
                    className="min-h-12 border-white/15 bg-white/92 text-slate-950 placeholder:text-slate-500"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {isConfirming ? (
                  <div className="space-y-4 rounded-2xl border border-red-200/30 bg-red-500/10 p-4 text-white">
                    <p className="text-base font-semibold text-white">
                      Confirm unsubscribe for {email}?
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsConfirming(false)}
                        disabled={isLoading}
                        className="min-h-12 rounded-full border border-white/15 bg-white/14 text-white hover:bg-white/20"
                      >
                        Keep subscription
                      </Button>
                      <Button
                        type="button"
                        onClick={handleUnsubscribe}
                        disabled={isLoading}
                        className="min-h-12 rounded-full bg-red-600 px-6 text-white shadow-lg shadow-black/20 hover:bg-red-500"
                      >
                        {isLoading ? "Unsubscribing..." : "Confirm unsubscribe"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm leading-6 text-white/72">
                      You can return to the home page at any time to subscribe again.
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!email) {
                          return;
                        }
                        setIsConfirming(true);
                      }}
                      disabled={isLoading}
                      className="min-h-12 rounded-full bg-white/16 px-6 text-white hover:bg-white/24"
                    >
                      Review unsubscribe
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
