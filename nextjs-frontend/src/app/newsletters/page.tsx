"use client";

import { useState, useEffect } from "react";
import Head from 'next/head';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";

const LANDSCAPE_IMAGES = [
  "/landscape_backgrounds/abbie-parks-XA1-J2rRGVw-unsplash.jpg",
  "/landscape_backgrounds/casper-van-battum-icWhBzRNUFw-unsplash.jpg",
  "/landscape_backgrounds/christopher-ott-qdcRECrSppU-unsplash.jpg",
  "/landscape_backgrounds/david-clode-8tZJG2t30fI-unsplash.jpg",
  "/landscape_backgrounds/david-clode-iQi_QFMfBZI-unsplash.jpg",
  "/landscape_backgrounds/david-clode-NugxTvRaQT0-unsplash.jpg",
  "/landscape_backgrounds/emanuel-rodriguez-2hdbY4Xaihw-unsplash.jpg",
  "/landscape_backgrounds/harshal-s-hirve-oZ0xzQFVCWY-unsplash.jpg",
  "/landscape_backgrounds/henry-schneider-s3sJ5j2ml2o-unsplash.jpg",
  "/landscape_backgrounds/james-wainscoat-WJ2ev0gQo4k-unsplash.jpg",
  "/landscape_backgrounds/jason-mitrione-MLAXy8PcGNk-unsplash.jpg",
  "/landscape_backgrounds/matt-seymour-qLvikxzTtWY-unsplash.jpg",
  "/landscape_backgrounds/nyusha-svoboda-_AaHmPTYzig-unsplash.jpg",
  "/landscape_backgrounds/patrick-hendry-_gHLz18DEpE-unsplash.jpg",
  "/landscape_backgrounds/patrick-hendry-hqcxvmNyFyg-unsplash.jpg",
  "/landscape_backgrounds/patrick-hendry-vOFzgDqPh3Y-unsplash (1).jpg",
  "/landscape_backgrounds/peter-neumann-Uofb3of6CCQ-unsplash.jpg",
  "/landscape_backgrounds/phoenix-han-2v_bZYAlKQ4-unsplash.jpg",
  "/landscape_backgrounds/sandra-alekseeva-h4vXoyKX_-Y-unsplash.jpg",
  "/landscape_backgrounds/timothy-dykes-3EUmV_AwKoA-unsplash.jpg",
  "/landscape_backgrounds/timothy-dykes-3JrIpTJ7tkM-unsplash.jpg",
  "/landscape_backgrounds/viktor-talashuk-0_cIDZw6rgc-unsplash.jpg",
  "/landscape_backgrounds/wolfgang-hasselmann-PUcrsXh9V4s-unsplash.jpg",
  "/landscape_backgrounds/zdenek-machacek-DwrVhMZmcaY-unsplash.jpg",
] as const;

const ImagePreloader = () => {
  return (
    <>
      {LANDSCAPE_IMAGES.map((src) => (
        <link 
          key={src}
          rel="preload"
          as="image"
          href={src}
        />
      ))}
    </>
  );
};

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

  const getRandomLandscapeImage = () => {
    const randomIndex = Math.floor(Math.random() * LANDSCAPE_IMAGES.length);
    return LANDSCAPE_IMAGES[randomIndex];
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
    <Layout>
      <Head>
        <ImagePreloader />
      </Head>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/atik-sulianami-xwiO6w6XEiM-unsplash.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
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
        <p className="text-center text-white/90 mb-4 drop-shadow-sm font-body">
          Browse through our archive of past newsletters. Each newsletter is
          sent out weekly and contains a curated list of top research articles.
        </p>
        <Separator className="mb-6 bg-white/20" />
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {newsletters.map((newsletter) => (
              <Card
                key={newsletter.id}
                className="relative overflow-hidden group h-48"
              >
                <Image
                  src={getRandomLandscapeImage()}
                  alt="Newsletter background"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                <a
                  href={newsletter.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 h-full p-6 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Myco Newsletter
                    </h2>
                    <p className="text-white/90">
                      Released {new Date(newsletter.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button className="w-fit bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-white/40">
                    View Newsletter →
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
