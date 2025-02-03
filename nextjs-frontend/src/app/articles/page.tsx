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

export default function Articles() {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("ss_articles").select("*");
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/samuel-pWeA162MJ9Q-unsplash.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center mt-10 mb-8 flex items-center justify-center gap-4 text-white drop-shadow-lg">
              <Image
                src="/android-chrome-512x512.png"
                alt="Mushroom Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full shadow-lg"
              />
              Research Articles
            </h1>
            <p className="text-center text-white/90 mb-4 drop-shadow-sm">
              Explore our collection of curated mycology research articles. Each
              article is summarized and analyzed to highlight key findings.
            </p>
            <Separator className="mb-6 bg-white/20"/>

            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {articles.map((article, index) => (
                  <Card
                    key={article.id ?? index}
                    className="p-6 backdrop-blur-md bg-white/90 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <p className="text-md font-semibold mb-2">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {article.venue}
                    </p>
                    <p className="text-sm mb-4 mt-4">{article.llm_summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        {article.publicationDate}
                        <img
                          src={article.favicon || "/semanticscholar_logo.png"}
                          alt="Source"
                          width={22}
                          height={22}
                          className="inline-block"
                        />
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="shadow-lg">Read More</Button>
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
