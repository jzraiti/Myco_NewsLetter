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
    return <p className="text-center text-white/80">No newsletters available yet.</p>;
  }

  const start = (pageResult.page - 1) * pageResult.pageSize + 1;
  const end = start + pageResult.items.length - 1;
  const previousPage = Math.max(1, pageResult.page - 1);
  const nextPage = Math.min(pageResult.totalPages, pageResult.page + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
        <p>Showing {start}-{end} of {pageResult.totalCount} newsletters</p>
        <span>Page {pageResult.page} of {pageResult.totalPages}</span>
      </div>

      {pageResult.totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 text-white/80">
          <Link
            href={buildNewslettersHref(previousPage)}
            aria-disabled={pageResult.page <= 1}
            className={pageResult.page <= 1 ? "pointer-events-none opacity-40" : "hover:text-white"}
          >
            Previous
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {renderPaginationLinks(pageResult)}
          </div>
          <Link
            href={buildNewslettersHref(nextPage)}
            aria-disabled={pageResult.page >= pageResult.totalPages}
            className={pageResult.page >= pageResult.totalPages ? "pointer-events-none opacity-40" : "hover:text-white"}
          >
            Next
          </Link>
        </div>
      ) : null}

      {pageResult.items.map((newsletter) => (
        <Card key={newsletter.id} className="relative overflow-hidden group h-48">
          <Image
            src={pickDeterministicBackground(newsletter.id, LANDSCAPE_BACKGROUND_IMAGES)}
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
              <h2 className="text-2xl font-semibold text-white mb-2">Myco Newsletter</h2>
              <p className="text-white/90">Released {new Date(newsletter.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-white/40 text-white">
              View Newsletter →
            </span>
          </a>
        </Card>
      ))}
    </div>
  );
}
