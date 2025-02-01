"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from("recipients").insert([{ email }]);

      if (error) throw error;
      alert("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      alert("Error subscribing. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Images */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="flex justify-center items-center space-x-20 px-32 py-16 max-w-7xl mx-auto mt-5">
          <Image
            src="/example_article_1.png"
            alt="Background Article 1"
            width={400}
            height={300}
            className="w-[550px] h-auto blur-[14px]"
          />
          <Image
            src="/example_article_2.png"
            alt="Background Article 2"
            width={400}
            height={300}
            className="w-[550px] h-auto blur-[14px]"
          />
        </div>
      </div> */}

      {/* Topbar */}
      <div className="w-full p-4 border-b">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <button
              className="font-bold flex items-center gap-2"
              onClick={() => (window.location.href = "/")}
            >
              <Image
                src="/mushroom_logo.jpg"
                alt="Mushroom Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              MycoNewsletter
            </button>
            <Link href="/newsletters" className="hover:text-gray-600">
              Previous Newsletters
            </Link>
            <Link href="/articles" className="hover:text-gray-600">
              Articles
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">
        <p
          className="font-bold flex items-center gap-2 text-3xl"
        >
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-12 h-12 "
          />
          MycoNewsletter
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

      {/* Footer */}
      <footer className="w-full p-4 border-t mt-auto bg-white/80">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-4 text-sm text-gray-500">
          <span>© 2024 MycoNewsletter. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/jzraiti/Myco_NewsLetter"
              className="hover:text-gray-600 inline-flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/github_logo.svg"
                alt="GitHub"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>GitHub</span>
            </Link>
            <Link href="/unsubscribe" className="hover:text-gray-600">
              Unsubscribe
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
