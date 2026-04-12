"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import type { PaginatedJufoResult } from "@/lib/public-data/types";

type JufoSearchControlsProps = {
  pageResult: PaginatedJufoResult;
};

function buildPageHref(
  pathname: string,
  searchParams: URLSearchParams,
  page: number,
  query: string,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(page));

  if (query) {
    params.set("q", query);
  } else {
    params.delete("q");
  }

  return `${pathname}?${params.toString()}`;
}

export function JufoSearchControls({ pageResult }: JufoSearchControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? pageResult.query;
  const previousPage = Math.max(1, pageResult.page - 1);
  const nextPage = Math.min(pageResult.totalPages, pageResult.page + 1);

  return (
    <div className="mb-6 space-y-5 rounded-[1.75rem] border border-white/15 bg-slate-950/34 p-5 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 text-white">
          <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/58">
            Search tools
          </p>
          <h2 className="font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">
            Search publications
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-white/76 sm:text-base">
            Refine the ranking list by publication name, publisher, country, language, or website without leaving the URL-driven server flow.
          </p>
        </div>
        <div className="rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/82 shadow-lg shadow-black/15">
          Showing page {pageResult.page} of {pageResult.totalPages}
        </div>
      </div>

      <div className="flex justify-center">
        <Input
          id="jufo-search"
          type="search"
          placeholder="Search publications..."
          aria-label="Search publications"
          defaultValue={currentQuery}
          className="min-h-12 max-w-xl border-white/15 bg-white/92 text-slate-950 placeholder:text-slate-500"
          onChange={(event) => {
            const params = new URLSearchParams(searchParams.toString());
            const nextQuery = event.target.value;

            if (nextQuery.trim()) {
              params.set("q", nextQuery);
            } else {
              params.delete("q");
            }

            params.set("page", "1");

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
          }}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/82 md:flex-row md:items-center md:justify-between">
        <Link
          href={buildPageHref(pathname, new URLSearchParams(searchParams.toString()), previousPage, currentQuery)}
          aria-disabled={pageResult.page <= 1}
          className={
            pageResult.page <= 1
              ? "pointer-events-none inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 opacity-40"
              : "inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/10 px-4 hover:border-white/20 hover:text-white"
          }
        >
          Previous
        </Link>
        <span className="inline-flex min-h-11 items-center rounded-full border border-[#8FAF6B]/35 bg-[#8FAF6B]/14 px-4 font-semibold text-white">
          Page {pageResult.page} of {pageResult.totalPages}
        </span>
        <Link
          href={buildPageHref(pathname, new URLSearchParams(searchParams.toString()), nextPage, currentQuery)}
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
    </div>
  );
}
