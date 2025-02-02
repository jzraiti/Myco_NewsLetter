"use client";

import { Layout } from "@/components/Layout";
import { Toast } from "@/components/ui/toast";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  }>({ show: false, message: "", variant: "success" });
  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("recipients")
        .update({ is_subscribed: false })
        .eq("email", email)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        showToast("Email not found", "error");
        return;
      }

      showToast("Unsubscribed successfully!", "success");
      setEmail("");
    } catch (error) {
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        variant={toast.variant}
      />
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">
        <p className="font-bold flex items-center gap-2 text-3xl">
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-12 h-12 "
          />
          MycoNewsletter
        </p>
        <p className="text-gray-600">We're sad to see you go!</p>
        <div className="w-full max-w-md flex gap-2 p-2 rounded-lg">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleUnsubscribe} disabled={isLoading}>
            {isLoading ? "Unsubscribing..." : "Unsubscribe"}
          </Button>
        </div>
      </main>
    </Layout>
  );
}
