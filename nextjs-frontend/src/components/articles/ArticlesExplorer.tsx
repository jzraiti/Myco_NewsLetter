"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LANDSCAPE_BACKGROUND_IMAGES, pickDeterministicBackground } from "@/lib/public-data/backgrounds";
import type { ArticleSummary, PaginatedArchiveResult } from "@/lib/public-data/types";

type ArticlesExplorerProps = {
  pageResult: PaginatedArchiveResult<ArticleSummary>;
};

function buildArticlesHref(pathname: string, searchParams: URLSearchParams, page: number, query: string) {
  const params = new URLSearchParams(searchParams.toString());

  if (page > 1 || query) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  if (query) {
    params.set("q", query);
  } else {
    params.delete("q");
  }

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

function buildPaginationModel(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

function renderPaginationLinks(
  pathname: string,
  searchParams: URLSearchParams,
  pageResult: PaginatedArchiveResult<ArticleSummary>,
  currentQuery: string,
) {
  const pages = buildPaginationModel(pageResult.page, pageResult.totalPages);

  return pages.map((pageNumber, index) => {
    const previousPage = pages[index - 1];
    const shouldRenderGap = previousPage != null && pageNumber - previousPage > 1;

    return (
      <Fragment key={pageNumber}>
        {shouldRenderGap ? <span className="text-white/50">...</span> : null}
        <Link
          href={buildArticlesHref(pathname, searchParams, pageNumber, currentQuery)}
          aria-current={pageNumber === pageResult.page ? "page" : undefined}
          className={
            pageNumber === pageResult.page
              ? "rounded-md border border-white/40 bg-white/20 px-3 py-1 text-white"
              : "rounded-md border border-white/20 bg-white/10 px-3 py-1 text-white/80 hover:text-white"
          }
        >
          {pageNumber}
        </Link>
      </Fragment>
    );
  });
}

export function ArticlesExplorer({ pageResult }: ArticlesExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? pageResult.query;
  const previousPage = Math.max(1, pageResult.page - 1);
  const nextPage = Math.min(pageResult.totalPages, pageResult.page + 1);
  const start = pageResult.totalCount === 0 ? 0 : (pageResult.page - 1) * pageResult.pageSize + 1;
  const end = start === 0 ? 0 : start + pageResult.items.length - 1;

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex justify-center">
          <Input
            type="search"
            placeholder="Search articles..."
            className="max-w-xl mx-auto bg-white/10 border-white/20 text-white placeholder:text-white/50"
            defaultValue={currentQuery}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams.toString());
              const nextQuery = event.target.value.trim();

              if (nextQuery) {
                params.set("q", nextQuery);
              } else {
                params.delete("q");
              }

              params.set("page", "1");

              router.replace(buildArticlesHref(pathname, params, 1, nextQuery), { scroll: false });
            }}
          />
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
          <p>Showing {start}-{end} of {pageResult.totalCount} articles</p>
          <span>Page {pageResult.page} of {pageResult.totalPages}</span>
        </div>

        {pageResult.totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 text-white/80">
            <Link
              href={buildArticlesHref(pathname, new URLSearchParams(searchParams.toString()), previousPage, currentQuery)}
              aria-disabled={pageResult.page <= 1}
              className={pageResult.page <= 1 ? "pointer-events-none opacity-40" : "hover:text-white"}
            >
              Previous
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {renderPaginationLinks(
                pathname,
                new URLSearchParams(searchParams.toString()),
                pageResult,
                currentQuery,
              )}
            </div>
            <Link
              href={buildArticlesHref(pathname, new URLSearchParams(searchParams.toString()), nextPage, currentQuery)}
              aria-disabled={pageResult.page >= pageResult.totalPages}
              className={
                pageResult.page >= pageResult.totalPages ? "pointer-events-none opacity-40" : "hover:text-white"
              }
            >
              Next
            </Link>
          </div>
        ) : null}
      </div>

      <div className="space-y-6 mb-6">
        {pageResult.items.length === 0 ? (
          <div className="space-y-3 text-center text-white/80">
            <p>No articles found for "{pageResult.query}".</p>
            <Link href="/articles" className="inline-flex text-white underline underline-offset-4 hover:text-white/80">
              Clear search
            </Link>
          </div>
        ) : (
          pageResult.items.map((article, index) => (
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
