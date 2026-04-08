import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const inputPath = path.join(projectRoot, "public", "jfp-export-Aug-7-2025-full.csv");
const outputDir = path.join(projectRoot, "src", "lib", "public-data", "generated");
const outputPath = path.join(outputDir, "jufo-publications.json");

function normalizeText(value) {
  return String(value ?? "").trim();
}

function toNullableNumber(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function buildSearchText(row) {
  return [
    row.name,
    row.publisher,
    row.level,
    row.website,
    row.country,
    row.language,
    row.yearStart,
    row.panels,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const rawCsv = await readFile(inputPath, "utf8");
const records = parse(rawCsv, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: false,
});

const publications = records
  .map((record) => {
    const name = normalizeText(record.Name);

    if (!name) {
      return null;
    }

    const publication = {
      id: normalizeText(record.Jufo_ID),
      name,
      publisher: normalizeText(record.Publisher),
      level: normalizeText(record.Level),
      website: normalizeText(record.Website) === "http://" ? "" : normalizeText(record.Website),
      country: normalizeText(record.Country),
      language: normalizeText(record.Language),
      yearStart: toNullableNumber(record.Year_Start),
      panels: normalizeText(record.panels),
      searchText: "",
    };

    publication.searchText = buildSearchText(publication);
    return publication;
  })
  .filter(Boolean)
  .sort((left, right) => {
    const nameComparison = left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
    if (nameComparison !== 0) {
      return nameComparison;
    }

    return left.publisher.localeCompare(right.publisher, undefined, { sensitivity: "base" });
  });

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(publications, null, 2)}\n`, "utf8");

console.log(`Wrote ${publications.length} JUFO publications to ${path.relative(projectRoot, outputPath)}`);
