"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LANDSCAPE_BACKGROUND_IMAGES, pickDeterministicBackground } from "@/lib/public-data/backgrounds";
import { filterArticlesByQuery } from "@/lib/public-data/content";
import type { ArticleSummary } from "@/lib/public-data/types";

type ArticlesExplorerProps = {
  articles: ArticleSummary[];
};

export function ArticlesExplorer({ articles }: ArticlesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(
    () => filterArticlesByQuery(articles, searchQuery),
    [articles, searchQuery],
  );

  return (
    <>
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search articles..."
          className="max-w-xl mx-auto bg-white/10 border-white/20 text-white placeholder:text-white/50"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className="space-y-6 mb-6">
        {filteredArticles.length === 0 ? (
          <p className="text-center text-white/80">No articles found matching your search.</p>
        ) : (
          filteredArticles.map((article, index) => (
            <Card key={article.id ?? index} className="relative overflow-hidden group min-h-[300px]">
              <Image
                src={pickDeterministicBackground(article.id ?? index, LANDSCAPE_BACKGROUND_IMAGES)}
                alt="Article background"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/85 transition-colors duration-300" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3 font-display">{article.title}</h2>
                  <p className="text-white/80 text-sm mb-4 font-body">
                    {article.venue ? article.venue : "Journal Unknown"}
                    {article.level ? ` • Level ${article.level}` : " • Not Graded"}{" "}
                    ({article.panels ? article.panels + " panels" : ""})
                  </p>
                  <div
                    className={
                      article.summary
                        ? "backdrop-blur-sm text-white/100 text-sm leading-relaxed bg-white/10 p-4 rounded-lg prose prose-invert prose-sm max-w-none font-body"
                        : ""
                    }
                  >
                    <ReactMarkdown>{article.summary || ""}</ReactMarkdown>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/20 mt-6">
                  <span className="text-md text-white/80 flex items-center gap-2">
                    Published {article.publicationDate}
                  </span>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
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
    </>
  );
}
