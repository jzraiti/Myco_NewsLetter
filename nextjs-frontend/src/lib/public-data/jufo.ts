import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { paginateItems } from "./pagination";
import { TEST_JUFO_ROWS } from "./test-fixtures";
import type { JufoQuery, JufoRow, PaginatedJufoResult } from "./types";
const GENERATED_JUFO_PATH = path.join(
  process.cwd(),
  "src/lib/public-data/generated/jufo-publications.json",
);

type GeneratedJufoRow = {
  id: string;
  name: string;
  publisher: string;
  level: string;
  website: string;
  country: string;
  language: string;
  yearStart: number | null;
  panels: string;
  searchText: string;
};

let jufoRowsPromise: Promise<JufoRow[]> | null = null;

function normalizeGeneratedRows(rows: GeneratedJufoRow[]): JufoRow[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    publisher: row.publisher,
    level: row.level || null,
    website: row.website,
    country: row.country,
    language: row.language,
    yearStart: row.yearStart,
    panels: row.panels || null,
    searchText: row.searchText,
  }));
}

async function loadGeneratedRows() {
  if (!jufoRowsPromise) {
    jufoRowsPromise = readFile(GENERATED_JUFO_PATH, "utf8").then((contents) =>
      normalizeGeneratedRows(JSON.parse(contents) as GeneratedJufoRow[]),
    );
  }

  return jufoRowsPromise;
}

export function normalizeJufoQuery(query: string) {
  return query.trim().toLowerCase();
}

export function filterJufoRows(rows: JufoRow[], query: string) {
  const normalizedQuery = normalizeJufoQuery(query);

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) => row.searchText.includes(normalizedQuery));
}

export async function getAllJufoRows() {
  return process.env.NEXT_PUBLIC_E2E_STATIC_DATA === "true" ? TEST_JUFO_ROWS : loadGeneratedRows();
}

export async function fetchJufoPage({ query, page }: JufoQuery): Promise<PaginatedJufoResult> {
  const normalizedQuery = normalizeJufoQuery(query);
  const allRows = await getAllJufoRows();
  const filteredRows = filterJufoRows(allRows, normalizedQuery);
  const paginated = paginateItems(filteredRows, page);

  return {
    ...paginated,
    query: normalizedQuery,
  };
}
