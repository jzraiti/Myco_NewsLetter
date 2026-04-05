import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ArticlesExplorer } from "./ArticlesExplorer";

const articles = [
  {
    id: 1,
    title: "Mycorrhiza strengthen drought resilience",
    venue: "Nature Ecology",
    publicationDate: "2026-03-12",
    level: 2,
    panels: 1,
    summary: "Mycorrhiza partnerships help plants tolerate dry conditions.",
    url: "https://example.com/article-1",
  },
  {
    id: 2,
    title: "Fungal decomposition accelerates carbon cycling",
    venue: "Fungal Biology",
    publicationDate: "2026-03-08",
    level: 1,
    panels: 2,
    summary: "Wood decay fungi rapidly recycle forest carbon stores.",
    url: "https://example.com/article-2",
  },
];

describe("ArticlesExplorer", () => {
  it("filters results by title, summary, and venue using filterArticlesByQuery", async () => {
    render(<ArticlesExplorer articles={articles} />);

    await userEvent.type(screen.getByPlaceholderText("Search articles..."), "Nature Ecology");

    expect(screen.getByText("Mycorrhiza strengthen drought resilience")).toBeInTheDocument();
    expect(screen.queryByText("Fungal decomposition accelerates carbon cycling")).not.toBeInTheDocument();
  });

  it("shows the empty-state copy when no articles match", async () => {
    render(<ArticlesExplorer articles={articles} />);

    await userEvent.type(screen.getByPlaceholderText("Search articles..."), "Nope");

    expect(screen.getByText("No articles found matching your search.")).toBeInTheDocument();
  });

  it("keeps deterministic backgrounds and the Read More CTA", () => {
    render(<ArticlesExplorer articles={articles} />);

    const articleImages = screen.getAllByAltText("Article background");
    expect(articleImages[0]).toHaveAttribute("src");
    expect(screen.getAllByRole("link", { name: /read more/i })).toHaveLength(2);
  });
});
