"use client";

import { useState , useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import { Toast } from "@/components/ui/toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
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

  // Function to get a random image
const getRandomImage = () => {
  const images = [
      '/backgrounds/boys-in-bristol-photography-Lo_KNBSCYUQ-unsplash.jpg',
      '/backgrounds/clyde-gravenberch-uj253l7xPFU-unsplash.jpg',
      '/backgrounds/diana-parkhouse-5prKIX4JLO0-unsplash.jpg',
      '/backgrounds/lance-reis-tJHKM92J_yM-unsplash.jpg',
      '/backgrounds/rosie-pritchard-epwBnTgYMAc-unsplash.jpg',
      '/backgrounds/samuel-pWeA162MJ9Q-unsplash.jpg',
      '/backgrounds/shiho-azuma-jbz9h7pWxkg-unsplash.jpg',
      '/backgrounds/timothy-dykes-DyraknirZ84-unsplash.jpg',
      '/backgrounds/timothy-dykes-zpuVzW5rv4Q-unsplash.jpg',
      '/backgrounds/wyxina-tresse-D74M77fOzyg-unsplash.jpg'
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

  const handleSubscribe = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      // First check if the user exists and their subscription status
      const { data: existingUser } = await supabase
        .from("recipients")
        .select("is_subscribed")
        .eq("email", email)
        .single();

      if (existingUser) {
        if (existingUser.is_subscribed) {
          showToast("You are already subscribed!", "error");
          return;
        }

        // Update existing user's subscription status
        const { error: updateError } = await supabase
          .from("recipients")
          .update({ is_subscribed: true })
          .eq("email", email);

        if (updateError) throw updateError.message;
      } else {
        
        // Insert new user
        const { error: insertError } = await supabase
          .from("recipients")
          .insert([{ email, is_subscribed: true }]);

        if (insertError) throw insertError.message;
      }

      showToast("Thanks for subscribing!", "success");
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
      <div
        style={{
          backgroundImage: `url(${getRandomImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      </div>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">
        <p className="font-bold flex items-center gap-2 text-3xl">
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-12 h-12 "
          />
          Mycoweekly
        </p>
        <h1 className="text-4xl font-bold text-center text-gray-800 drop-shadow-sm">
          Your Weekly Dose of Mycology Research
        </h1>

        {/* Email input */}
        <div className="w-full max-w-md flex gap-2 p-2 rounded-lg">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubscribe} disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2">Weekly Updates</h3>
            <p className="text-sm text-gray-600">
              Get the latest research delivered to your inbox
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2">Curated Content</h3>
            <p className="text-sm text-gray-600">
              Hand-picked articles from top journals
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2">AI Summaries</h3>
            <p className="text-sm text-gray-600">
              Concise, readable research breakdowns
            </p>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
