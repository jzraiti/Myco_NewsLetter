import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PaginatedArchiveResult } from "@/lib/public-data/types";

import { ArticlesExplorer } from "./ArticlesExplorer";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/articles",
  useRouter: () => ({ replace }),
  useSearchParams: () =>
    new URLSearchParams({
      page: "2",
      q: "Mycorrhiza",
    }),
}));

const pageResult: PaginatedArchiveResult<{
  id: string;
  title: string;
  venue: string | null;
  publicationDate: string;
  level: number | string | null;
  panels: number | string | null;
  summary: string;
  url: string;
}> = {
  items: [
    {
      id: "13",
      title: "Fungal biocrusts improve desert retention",
      venue: "Arid Land Research",
      publicationDate: "2026-02-25",
      level: 1,
      panels: 2,
      summary: "Surface fungal mats help soils retain water after rare rainfall.",
      url: "https://example.com/article-13",
    },
    {
      id: "14",
      title: "Mycorrhiza rebalance phosphorus allocation",
      venue: "Nature Ecology",
      publicationDate: "2026-02-24",
      level: 2,
      panels: 2,
      summary: "Mycorrhiza alter phosphorus routing across competing plants.",
      url: "https://example.com/article-14",
    },
    {
      id: "15",
      title: "Fixture Article 15",
      venue: "Fungal Ecology",
      publicationDate: "2026-02-23",
      level: 1,
      panels: 1,
      summary: "A deterministic archive row reserved for page-two coverage.",
      url: "https://example.com/article-15",
    },
  ],
  page: 2,
  totalPages: 2,
  totalCount: 15,
  pageSize: 12,
  query: "Mycorrhiza",
};

describe("ArticlesExplorer", () => {
  beforeEach(() => {
    replace.mockReset();
  });

  it("renders only the current page slice with pagination feedback", () => {
    render(<ArticlesExplorer pageResult={pageResult} />);

    expect(screen.getAllByText("Showing 13-15 of 15 articles")).toHaveLength(2);
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Fungal biocrusts improve desert retention")).toBeInTheDocument();
    expect(screen.queryByText("Mycorrhiza strengthen drought resilience")).not.toBeInTheDocument();
  });

  it("preserves q in paging links and resets search to /articles?page=1&q=...", async () => {
    render(<ArticlesExplorer pageResult={pageResult} />);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/articles?page=1&q=Mycorrhiza",
    );

    const searchInput = screen.getByPlaceholderText("Search articles...");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "fungal");

    expect(replace).toHaveBeenLastCalledWith("/articles?page=1&q=fungal", { scroll: false });
  });

  it("shows the clear-search empty state", () => {
    render(
      <ArticlesExplorer
        pageResult={{
          ...pageResult,
          items: [],
          page: 1,
          totalPages: 1,
          totalCount: 0,
          query: "Nope",
        }}
      />,
    );

    expect(screen.getByText("No articles match this search.")).toBeInTheDocument();
    expect(
      screen.getByText("Try a broader search or clear the current query to keep browsing the archive."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Clear search" })).toHaveAttribute("href", "/articles");
  });

  it("keeps current-page semantics on numbered pagination links", () => {
    render(<ArticlesExplorer pageResult={pageResult} />);

    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("keeps deterministic backgrounds and the Read More CTA", () => {
    render(<ArticlesExplorer pageResult={pageResult} />);

    const articleImages = screen.getAllByAltText("Article background");
    expect(articleImages[0]).toHaveAttribute("src");
    expect(screen.getAllByRole("link", { name: /read more/i })).toHaveLength(3);
  });
});
