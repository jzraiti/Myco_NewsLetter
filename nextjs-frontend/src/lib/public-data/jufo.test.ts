import { describe, expect, it } from "vitest";

import { TEST_JUFO_ROWS } from "./test-fixtures";
import { fetchJufoPage, filterJufoRows } from "./jufo";

describe("jufo data helpers", () => {
  it("returns a 50-row first page with the full deterministic fixture count", async () => {
    process.env.NEXT_PUBLIC_E2E_STATIC_DATA = "true";

    const result = await fetchJufoPage({ query: "", page: 1 });

    expect(result.items).toHaveLength(50);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(50);
    expect(result.totalCount).toBe(TEST_JUFO_ROWS.length);
  });

  it("clamps to the last filtered page and keeps only matching rows", async () => {
    process.env.NEXT_PUBLIC_E2E_STATIC_DATA = "true";

    const result = await fetchJufoPage({ query: "fixture publication 11", page: 99 });

    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.totalCount).toBe(1);
    expect(result.items.map((row) => row.name)).toEqual(["Fixture Publication 11"]);
  });

  it("matches rows through case-insensitive normalized search text", () => {
    const result = filterJufoRows(TEST_JUFO_ROWS, "  ELSEVIER  ");

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((row) => row.searchText.includes("elsevier"))).toBe(true);
  });
});
