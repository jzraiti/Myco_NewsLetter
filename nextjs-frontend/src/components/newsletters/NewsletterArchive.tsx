import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { LANDSCAPE_BACKGROUND_IMAGES, pickDeterministicBackground } from "@/lib/public-data/backgrounds";
import type { NewsletterSummary, PaginatedArchiveResult } from "@/lib/public-data/types";

type NewsletterArchiveProps = {
  pageResult: PaginatedArchiveResult<NewsletterSummary>;
};

function buildNewslettersHref(page: number) {
  return page > 1 ? `/newsletters?page=${page}` : "/newsletters";
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

function renderPaginationLinks(pageResult: PaginatedArchiveResult<NewsletterSummary>) {
  const pages = buildPaginationModel(pageResult.page, pageResult.totalPages);

  return pages.map((pageNumber, index) => {
    const previousPage = pages[index - 1];
    const shouldRenderGap = previousPage != null && pageNumber - previousPage > 1;

    return (
      <Fragment key={pageNumber}>
        {shouldRenderGap ? <span className="text-white/50">...</span> : null}
        <Link
          href={buildNewslettersHref(pageNumber)}
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

export function NewsletterArchive({ pageResult }: NewsletterArchiveProps) {
  if (pageResult.totalCount === 0) {
    return (
      <div className="rounded-[1.75rem] border border-white/15 bg-slate-950/36 px-6 py-10 text-center text-white/82 shadow-xl shadow-black/20 backdrop-blur-xl">
        <p className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">
          No newsletters available yet.
        </p>
      </div>
    );
  }

  const start = (pageResult.page - 1) * pageResult.pageSize + 1;
  const end = start + pageResult.items.length - 1;
  const previousPage = Math.max(1, pageResult.page - 1);
  const nextPage = Math.min(pageResult.totalPages, pageResult.page + 1);

  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-[1.75rem] border border-white/15 bg-slate-950/34 p-5 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 text-white">
            <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/58">
              Archive summary
            </p>
            <h2 className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">
              Browse previous issues
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-white/76 sm:text-base">
              Keep moving through numbered pages without losing your place in the newsletter archive.
            </p>
          </div>
          <div className="rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/82 shadow-lg shadow-black/15">
            Showing {start}-{end} of {pageResult.totalCount} newsletters
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/82 md:flex-row md:items-center md:justify-between">
          <p>Showing {start}-{end} of {pageResult.totalCount} newsletters</p>
          <span className="inline-flex min-h-11 items-center rounded-full border border-[#8FAF6B]/35 bg-[#8FAF6B]/14 px-4 font-semibold text-white">
            Page {pageResult.page} of {pageResult.totalPages}
          </span>
        </div>

        {pageResult.totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 text-white/80">
            <Link
              href={buildNewslettersHref(previousPage)}
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
              {renderPaginationLinks(pageResult)}
            </div>
            <Link
              href={buildNewslettersHref(nextPage)}
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

      {pageResult.items.map((newsletter) => (
        <Card key={newsletter.id} className="group relative h-auto min-h-[260px] overflow-hidden rounded-[1.75rem] border-white/12 shadow-xl shadow-black/25">
          <Image
            src={pickDeterministicBackground(newsletter.id, LANDSCAPE_BACKGROUND_IMAGES)}
            alt="Newsletter background"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/62 transition-colors duration-300 group-hover:bg-black/50" />
          <a
            href={newsletter.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7"
          >
            <div className="space-y-4">
              <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/58">
                Weekly issue
              </p>
              <h2 className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white sm:text-3xl">
                Myco Newsletter
              </h2>
              <p className="max-w-xl text-sm leading-6 text-white/84 sm:text-base">
                Released {new Date(newsletter.createdAt).toLocaleDateString()} with a curated set of top mycology research highlights.
              </p>
            </div>
            <span className="inline-flex min-h-11 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/12 px-5 text-sm font-medium text-white transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/20">
              View Newsletter →
            </span>
          </a>
        </Card>
      ))}
    </div>
  );
}
