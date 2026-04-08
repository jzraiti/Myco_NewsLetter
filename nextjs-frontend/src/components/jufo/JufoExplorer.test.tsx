import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PaginatedJufoResult } from "@/lib/public-data/types";

import { JufoExplorer } from "./JufoExplorer";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/jufo",
  useRouter: () => ({ push, replace }),
  useSearchParams: () =>
    new URLSearchParams({
      page: "2",
      q: "Fixture Publication",
    }),
}));

const pageResult: PaginatedJufoResult = {
  items: [
    {
      id: 51,
      name: "Fixture Publication 51",
      publisher: "Elsevier",
      level: 1,
      website: "https://example.com/jufo/51",
      country: "United Kingdom",
      language: "English",
      yearStart: 2041,
      panels: "4",
      searchText: "fixture publication 51 elsevier united kingdom english https://example.com/jufo/51 1 4",
    },
  ],
  page: 2,
  totalPages: 2,
  totalCount: 55,
  pageSize: 50,
  query: "fixture publication",
};

describe("JufoExplorer", () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
  });

  it("renders only the current page slice", () => {
    render(<JufoExplorer pageResult={pageResult} />);

    expect(screen.getByText("Fixture Publication 51")).toBeInTheDocument();
    expect(screen.queryByText("Fixture Publication 01")).not.toBeInTheDocument();
  });

  it("shows the empty-state copy when no rows match", () => {
    render(
      <JufoExplorer
        pageResult={{
          ...pageResult,
          items: [],
          totalCount: 0,
          totalPages: 1,
          page: 1,
        }}
      />,
    );

    expect(screen.getByText("No publications found matching your search.")).toBeInTheDocument();
  });

  it("preserves the query in paging links and resets page to 1 on search", async () => {
    render(<JufoExplorer pageResult={pageResult} />);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("link", { name: "Previous" }));
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/jufo?page=1&q=Fixture+Publication",
    );

    const searchInput = screen.getByPlaceholderText("Search publications...");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "Fixture Publication 11");

    expect(replace).toHaveBeenLastCalledWith("/jufo?page=1&q=Fixture+Publication+11", {
      scroll: false,
    });
  });
});
