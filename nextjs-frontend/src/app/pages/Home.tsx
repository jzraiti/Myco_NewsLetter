"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
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
      const { error } = await supabase
        .from('recipients')
        .insert([{ email }]);

      if (error) throw error;
      alert('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      alert('Error subscribing. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <div className="w-full p-4 border-b">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <button
              className="font-bold flex items-center gap-2"
              onClick={() => (window.location.href = "/")}
            >
              <img
                src="/mushroom_logo.jpg"
                alt="Mushroom Logo"
                className="w-8 h-8"
              />
              MycoNewsletter
            </button>
            <Link href="/newsletters" className="hover:text-gray-600">Previous Newsletters</Link>
            <Link href="/articles" className="hover:text-gray-600">Articles</Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
        <h1 className="text-4xl font-bold text-center">
          Your Weekly Dose of Mycology Research
        </h1>

        {/* Email input */}
        <div className="w-full max-w-md flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
          >
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
      <footer className="w-full p-4 border-t mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          © 2024 MycoNewsletter. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
