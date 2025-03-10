"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";

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
      {LANDSCAPE_IMAGES.map((src, index) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
    </>
  );
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const articleBackgrounds = new Map<string | number, string>();

export default function Articles() {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getRandomLandscapeImage = () => {
    const randomIndex = Math.floor(Math.random() * LANDSCAPE_IMAGES.length);
    return LANDSCAPE_IMAGES[randomIndex];
  };

  const getArticleBackground = (articleId: string | number) => {
    if (!articleBackgrounds.has(articleId)) {
      articleBackgrounds.set(articleId, getRandomLandscapeImage());
    }
    return articleBackgrounds.get(articleId)!;
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("ss_articles").select("*");
      if (error) throw error;
      data.sort((a: any, b: any) => {
        return (
          new Date(b.publicationDate).getTime() -
          new Date(a.publicationDate).getTime()
        );
      });
      setArticles(
        data.filter((article: any) => {
          return article.Level != null;
        }) || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(searchLower) ||
      article.llm_summary?.toLowerCase().includes(searchLower) ||
      article.venue?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <Head>
        <ImagePreloader />
      </Head>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/alexx-cooper-VB3cvKx9-Hc-unsplash.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mt-10 mb-8 flex items-center justify-center gap-4 text-white drop-shadow-lg font-display">
              <Image
                src="/android-chrome-512x512.png"
                alt="Mushroom Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full shadow-lg"
              />
              Research Articles
            </h1>
            <p className="text-center text-white/90 mb-4 drop-shadow-sm font-body">
              Explore our collection of curated mycology research articles. Each
              article is summarized and analyzed to highlight key findings.
            </p>
            <Separator className="mb-6 bg-white/20" />

            <div className="mb-6">
              <Input
                type="search"
                placeholder="Search articles..."
                className="max-w-xl mx-auto bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="space-y-6 mb-6">
                {filteredArticles.length === 0 ? (
                  <p className="text-center text-white/80">
                    No articles found matching your search.
                  </p>
                ) : (
                  filteredArticles.map((article, index) => (
                    <Card
                      key={article.id ?? index}
                      className="relative overflow-hidden group min-h-[300px]"
                    >
                      <Image
                        src={getArticleBackground(article.id ?? index)}
                        alt="Article background"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/55 group-hover:bg-black/85 transition-colors duration-300" />
                      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-white mb-3 font-display">
                            {article.title}
                          </h2>
                          <p className="text-white/80 text-sm mb-4 font-body">
                            {article.venue ? article.venue : "Journal Unknown"}
                            {article.Level
                              ? ` • Level ${article.Level}`
                              : " • Not Graded"}{" "}
                            ({article.panels ? article.panels + " panels" : ""})
                          </p>
                          <div
                            className={`${
                              article.llm_summary
                                ? "backdrop-blur-sm text-white/100 text-sm leading-relaxed bg-white/10 p-4 rounded-lg prose prose-invert prose-sm max-w-none font-body"
                                : ""
                            }`}
                          >
                            <ReactMarkdown>
                              {article.llm_summary || ""}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-white/20 mt-6">
                          <span className="text-md text-white/80 flex items-center gap-2">
                            Published {article.publicationDate}
                          </span>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button className="w-fit bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300">
                              Read More →
                            </Button>
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
