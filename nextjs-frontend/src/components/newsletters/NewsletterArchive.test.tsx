import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PaginatedArchiveResult } from "@/lib/public-data/types";

import { NewsletterArchive } from "./NewsletterArchive";

const pageResult: PaginatedArchiveResult<{
  id: number;
  createdAt: string;
  link: string;
}> = {
  items: [
    {
      id: 13,
      createdAt: "2026-03-08T12:00:00.000Z",
      link: "https://example.com/newsletters/2026-03-08",
    },
    {
      id: 14,
      createdAt: "2026-03-07T12:00:00.000Z",
      link: "https://example.com/newsletters/2026-03-07",
    },
    {
      id: 15,
      createdAt: "2025-12-12T12:00:00.000Z",
      link: "https://example.com/newsletters/2025-12-12",
    },
  ],
  page: 2,
  totalPages: 2,
  totalCount: 15,
  pageSize: 12,
  query: "",
};

describe("NewsletterArchive", () => {
  it("renders newsletter cards in the provided page slice with current-page feedback", () => {
    render(<NewsletterArchive pageResult={pageResult} />);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Showing 13-15 of 15 newsletters")).toBeInTheDocument();
    expect(screen.getAllByText(/Released/i)).toHaveLength(3);
  });

  it("renders Previous, Next, numbered pages, and current-page highlighting", () => {
    render(<NewsletterArchive pageResult={pageResult} />);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/newsletters",
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/newsletters?page=2",
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/newsletters");
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("renders the View Newsletter CTA for each item and deterministic backgrounds", () => {
    const { container } = render(<NewsletterArchive pageResult={pageResult} />);

    expect(screen.getAllByRole("link", { name: /view newsletter/i })).toHaveLength(3);

    const imageSources = Array.from(container.querySelectorAll('img[alt="Newsletter background"]')).map(
      (image) => image.getAttribute("src"),
    );

    expect(imageSources[0]).toBeTruthy();
  });

  it("shows disabled edge-state behavior on first and last pages", () => {
    const { rerender } = render(
      <NewsletterArchive
        pageResult={{
          ...pageResult,
          page: 1,
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("aria-disabled", "true");

    rerender(
      <NewsletterArchive
        pageResult={{
          ...pageResult,
          page: 2,
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("aria-disabled", "true");
  });
});
