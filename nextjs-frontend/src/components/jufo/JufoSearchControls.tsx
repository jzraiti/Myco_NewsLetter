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
    <div className="mb-6 space-y-4">
      <div className="flex justify-center">
        <Input
          type="search"
          placeholder="Search publications..."
          defaultValue={currentQuery}
          className="max-w-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
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

      <div className="flex items-center justify-between gap-4 text-white/80">
        <Link
          href={buildPageHref(pathname, new URLSearchParams(searchParams.toString()), previousPage, currentQuery)}
          aria-disabled={pageResult.page <= 1}
          className={pageResult.page <= 1 ? "pointer-events-none opacity-40" : "hover:text-white"}
        >
          Previous
        </Link>
        <span>Page {pageResult.page} of {pageResult.totalPages}</span>
        <Link
          href={buildPageHref(pathname, new URLSearchParams(searchParams.toString()), nextPage, currentQuery)}
          aria-disabled={pageResult.page >= pageResult.totalPages}
          className={pageResult.page >= pageResult.totalPages ? "pointer-events-none opacity-40" : "hover:text-white"}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
