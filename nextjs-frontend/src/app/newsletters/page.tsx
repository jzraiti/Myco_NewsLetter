"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PreviousNewsletters() {
  const [isLoading, setIsLoading] = useState(false);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  const fetchNewsletters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("newsletters").select("*");
      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/lance-reis-tJHKM92J_yM-unsplash.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 " />
        </div>
      </div>

      <div className="flex flex-col p-6 max-w-3xl mx-auto flex-1">
        <h1 className="text-4xl font-bold text-center mt-10 mb-8 flex items-center justify-center gap-4 text-white drop-shadow-lg">
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full shadow-lg"
          />
          Previous Newsletters
        </h1>
        <p className="text-center text-white/90 mb-4 drop-shadow-sm">
          Browse through our archive of past newsletters. Each newsletter is
          sent out weekly and contains a curated list of top research articles.
        </p>
        <Separator className="mb-6 bg-white/20"/>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <Card
                key={newsletter.id}
                className="p-6 backdrop-blur-md bg-white/90 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <a
                  href={newsletter.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    Release - {new Date(newsletter.created_at).toLocaleDateString()}
                  </h2>
                  <Button className="mt-4 shadow-lg">View Newsletter</Button>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
