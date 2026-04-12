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
      <div className="mb-6 space-y-5 rounded-[1.75rem] border border-white/15 bg-slate-950/34 p-5 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-6">
        <div className="space-y-3 text-white">
          <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/58">
            Archive tools
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <h2 className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">
                Search and browse the archive
              </h2>
              <p className="text-sm leading-6 text-white/76 sm:text-base">
                Use search to refine article topics, then move between numbered pages without losing the current query.
              </p>
            </div>
            <div className="rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/82 shadow-lg shadow-black/15">
              Showing {start}-{end} of {pageResult.totalCount} articles
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Input
            type="search"
            placeholder="Search articles..."
            aria-label="Search articles"
            className="mx-auto min-h-12 max-w-xl border-white/15 bg-white/92 text-slate-950 placeholder:text-slate-500"
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

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/82 md:flex-row md:items-center md:justify-between">
          <p className="leading-6">Showing {start}-{end} of {pageResult.totalCount} articles</p>
          <span className="inline-flex min-h-11 items-center rounded-full border border-[#8FAF6B]/35 bg-[#8FAF6B]/14 px-4 font-semibold text-white">
            Page {pageResult.page} of {pageResult.totalPages}
          </span>
        </div>

        {pageResult.totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 text-white/80">
            <Link
              href={buildArticlesHref(pathname, new URLSearchParams(searchParams.toString()), previousPage, currentQuery)}
              aria-disabled={pageResult.page <= 1}
              className={
                pageResult.page <= 1
                  ? "pointer-events-none inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 opacity-40"
                  : "inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/10 px-4 hover:border-white/20 hover:text-white"
              }
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
                pageResult.page >= pageResult.totalPages
                  ? "pointer-events-none inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 opacity-40"
                  : "inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/10 px-4 hover:border-white/20 hover:text-white"
              }
            >
              Next
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mb-6 space-y-6">
        {pageResult.items.length === 0 ? (
          <div className="space-y-4 rounded-[1.75rem] border border-white/15 bg-slate-950/36 px-6 py-10 text-center text-white/82 shadow-xl shadow-black/20 backdrop-blur-xl">
            {currentQuery ? (
              <>
                <p className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">
                  No articles match this search.
                </p>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                  Try a broader search or clear the current query to keep browsing the archive.
                </p>
                <Link href="/articles" className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/10 px-4 text-white hover:bg-white/16">
                  Clear search
                </Link>
              </>
            ) : (
              <p className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">
                No articles available yet.
              </p>
            )}
          </div>
        ) : (
          pageResult.items.map((article, index) => (
            <Card key={article.id ?? index} className="group relative min-h-[320px] overflow-hidden rounded-[1.75rem] border-white/12 shadow-xl shadow-black/25">
              <Image
                src={pickDeterministicBackground(article.id ?? index, LANDSCAPE_BACKGROUND_IMAGES)}
                alt="Article background"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/65 transition-colors duration-300 group-hover:bg-black/78" />
              <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
                <div>
                  <p className="mb-3 font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.26em] text-white/58">
                    {article.venue ? article.venue : "Journal Unknown"}
                  </p>
                  <h2 className="mb-4 font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">{article.title}</h2>
                  <p className="mb-4 text-sm text-white/82 font-body">
                    {article.level ? `JUFO Level ${article.level}` : "JUFO level unavailable"}
                    {article.panels ? ` • ${article.panels} panels` : ""}
                  </p>
                  <div
                    className={
                      article.summary
                        ? "prose prose-invert prose-sm max-w-none rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/98 backdrop-blur-sm font-body"
                        : ""
                    }
                  >
                    <ReactMarkdown>{article.summary || ""}</ReactMarkdown>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-4 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-white/80">
                    Published {article.publicationDate}
                  </span>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button className="min-h-11 w-fit rounded-full border border-white/20 bg-white/12 px-5 text-white transition-all duration-300 hover:bg-white/22">
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
