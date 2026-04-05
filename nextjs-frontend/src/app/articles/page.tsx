import Image from "next/image";

import { ArticlesExplorer } from "@/components/articles/ArticlesExplorer";
import { Layout } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { fetchPublishedArticles } from "@/lib/public-data/content";

export default async function Articles() {
  const articles = await fetchPublishedArticles();

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: "url('/backgrounds/alexx-cooper-VB3cvKx9-Hc-unsplash.jpg')",
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

            <ArticlesExplorer articles={articles} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
