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

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">
        <p className="font-bold flex items-center gap-2 text-3xl text-white drop-shadow-lg">
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full shadow-lg"
          />
          MycoWeekly
        </p>
        <p className="text-white/90 text-xl drop-shadow-sm">We are sad to see you go!</p>
        <div className="w-full max-w-md flex gap-2 p-2 rounded-lg backdrop-blur-md bg-white/10">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white/90 placeholder:text-gray-500"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            {isLoading ? "Unsubscribing..." : "Unsubscribe"}
          </Button>
        </div>
      </main>
    </>
  );
}
