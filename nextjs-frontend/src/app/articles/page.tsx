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
      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center mt-10 mb-8 flex items-center justify-center gap-4">
              <Image
                src="/android-chrome-512x512.png"
                alt="Mushroom Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              Research Articles
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Explore our collection of curated mycology research articles. Each
              article is summarized and analyzed to highlight key findings and
              implications.
            </p>
            <Separator className="mb-6" />

            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {articles.map((article, index) => (
                  <Card
                    key={article.id ?? index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <p className="text-md font-semibold mb-2">
                      {article.title}
                    </p>
                    <span className="text-sm text-gray-500">
                    <p className="text-sm text-gray-500 mb-2">
                      {article.venue}
                    </p>
                    </span>
                    <p className="text-sm mb-4 mt-4">{article.llm_summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {article.publicationDate}
                        <img
                          src={
                            article.favicon
                              ? article.favicon
                              : "/semanticscholar_logo.png"
                          }
                          alt="Favicon"
                          width={22}
                          height={22}
                          className="inline-block ml-2"
                        />
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button>Read More</Button>
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
