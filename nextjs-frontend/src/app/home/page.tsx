"use client";
import Link from "next/link";
import { useState , useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { Layout } from "@/components/Layout";
import { Toast } from "@/components/ui/toast";
import Head from 'next/head';

// Move array outside component
const BACKGROUND_IMAGES = [
  '/backgrounds/angelina-korolchak-FRRZK1ULzRM-unsplash.jpg',
  '/backgrounds/abhijeet-majhi-5y1YGhrsH0c-unsplash.jpg',
  '/backgrounds/alexx-cooper-VB3cvKx9-Hc-unsplash.jpg',
  '/backgrounds/atik-sulianami-xwiO6w6XEiM-unsplash.jpg',
  '/backgrounds/boys-in-bristol-photography-Lo_KNBSCYUQ-unsplash.jpg',
  '/backgrounds/bruno-kelzer-75-aDN68ZJE-unsplash.jpg',
  '/backgrounds/clyde-gravenberch-uj253l7xPFU-unsplash.jpg',
  '/backgrounds/damir-omerovic-UMaGtammiSI-unsplash.jpg',
  '/backgrounds/diana-parkhouse-5prKIX4JLO0-unsplash.jpg',
  '/backgrounds/giorgi-iremadze-10Xp5lIq5wY-unsplash.jpg',
  '/backgrounds/jan-kopriva-y_U0VqiKFFk-unsplash.jpg',
  '/backgrounds/kier-in-sight-archives-0kKBt4dGwN4-unsplash.jpg',
  '/backgrounds/lance-reis-tJHKM92J_yM-unsplash.jpg',
  '/backgrounds/lucas-marulier-o5qGmMRquOg-unsplash.jpg',
  '/backgrounds/mason-unrau-LpAsInS9ctU-unsplash.jpg',
  '/backgrounds/rosie-pritchard-epwBnTgYMAc-unsplash.jpg',
  '/backgrounds/samuel-pWeA162MJ9Q-unsplash.jpg',
  '/backgrounds/shiho-azuma-jbz9h7pWxkg-unsplash.jpg',
  '/backgrounds/timothy-dykes-DyraknirZ84-unsplash.jpg',
  '/backgrounds/timothy-dykes-zpuVzW5rv4Q-unsplash.jpg',
  '/backgrounds/vlad-rudkov-UMAJG4y1mm0-unsplash.jpg',
  '/backgrounds/wyxina-tresse-D74M77fOzyg-unsplash.jpg',
  '/backgrounds/wyxina-tresse-iNfpmebMc4k-unsplash.jpg',
] as const;

// Add image preload component
const ImagePreloader = () => {
  return (
    <>
      {BACKGROUND_IMAGES.map((src, index) => (
        <link 
          key={src}
          rel="preload"
          as="image"
          href={src}
          // Priority for first image only
          {...(index === 0 ? {priority: true} : {})}
        />
      ))}
    </>
  );
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  }>({ show: false, message: "", variant: "success" });
  const [backgroundImage, setBackgroundImage] = useState('');

  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const fetchSubscriberCount = async () => {
    try {
      const { count } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true })
      
      setSubscriberCount(count || 0);
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
    }
  };

  useEffect(() => {
    fetchSubscriberCount();
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setBackgroundImage(BACKGROUND_IMAGES[randomIndex]);
  }, []);

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
      <Head>
        <ImagePreloader />
      </Head>
      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        variant={toast.variant}
      />
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
          In parntership with
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
            onChange={(e) => setEmail(e.target.value)}
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
              href: "/newsletters"
            },
            {
              title: "Curated Content",
              description: "Selected articles from only the highest JUFO rated journals",
              href: "/jufo"
            },
            {
              title: "Article Summaries",
              description: "Concise, readable research breakdowns for quick reference",
              href: "/articles"
            }
          ].map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card 
                className="p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md bg-white/20"
              >
                <h3 className="font-semibold mb-2 font-display text-white">{feature.title}</h3>
                <p className="text-sm text-white font-body">
                  {feature.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center px-6 py-3 rounded-lg">
          <p className="text-white">
            <span>Join the other </span>
            <span className="font-bold text-xl">{subscriberCount}</span>
            <span> mycologists subscribed!</span>
          </p>
        </div>
      </main>
    </Layout>
  );
}
