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
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/shiho-azuma-jbz9h7pWxkg-unsplash.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 " />
        </div>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
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
            onChange={(e) => setEmail(e.target.value)}
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
    </Layout>
  );
}
