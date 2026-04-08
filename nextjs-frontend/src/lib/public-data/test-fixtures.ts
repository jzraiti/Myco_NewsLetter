import type { ArticleSummary, JufoRow, NewsletterSummary } from "./types";

export const TEST_SUBSCRIBER_COUNT = 2;

export const TEST_NEWSLETTERS: NewsletterSummary[] = [
  {
    id: 1,
    createdAt: "2026-03-20T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-20",
  },
  {
    id: 2,
    createdAt: "2026-03-19T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-19",
  },
  {
    id: 3,
    createdAt: "2026-03-18T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-18",
  },
  {
    id: 4,
    createdAt: "2026-03-17T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-17",
  },
  {
    id: 5,
    createdAt: "2026-03-16T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-16",
  },
  {
    id: 6,
    createdAt: "2026-03-15T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-15",
  },
  {
    id: 7,
    createdAt: "2026-03-14T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-14",
  },
  {
    id: 8,
    createdAt: "2026-03-13T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-13",
  },
  {
    id: 9,
    createdAt: "2026-03-12T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-12",
  },
  {
    id: 10,
    createdAt: "2026-03-11T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-11",
  },
  {
    id: 11,
    createdAt: "2026-03-10T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-10",
  },
  {
    id: 12,
    createdAt: "2026-03-09T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-09",
  },
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
];

export const TEST_ARTICLES: ArticleSummary[] = [
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
  {
    id: 3,
    title: "Fungal networks improve seedling survival",
    venue: "Mycological Progress",
    publicationDate: "2026-03-07",
    level: 2,
    panels: 1,
    summary: "Shared fungal networks boost early plant establishment in dry soils.",
    url: "https://example.com/article-3",
  },
  {
    id: 4,
    title: "Lichen partnerships stabilize alpine soils",
    venue: "Ecology Letters",
    publicationDate: "2026-03-06",
    level: 2,
    panels: 3,
    summary: "Lichen communities reduce erosion across exposed alpine terrain.",
    url: "https://example.com/article-4",
  },
  {
    id: 5,
    title: "Soil fungi reshape nutrient exchange",
    venue: "Soil Systems",
    publicationDate: "2026-03-05",
    level: 1,
    panels: 2,
    summary: "Belowground fungi reorganize phosphorus and nitrogen movement.",
    url: "https://example.com/article-5",
  },
  {
    id: 6,
    title: "Mushroom metabolites deter crop pathogens",
    venue: "Plant Pathology",
    publicationDate: "2026-03-04",
    level: 2,
    panels: 1,
    summary: "Extracted fungal compounds suppress multiple common field pathogens.",
    url: "https://example.com/article-6",
  },
  {
    id: 7,
    title: "Endophytes improve wheat recovery after heat shock",
    venue: "Agronomy",
    publicationDate: "2026-03-03",
    level: 1,
    panels: 2,
    summary: "Symbiotic endophytes help wheat rebound after short heat events.",
    url: "https://example.com/article-7",
  },
  {
    id: 8,
    title: "Marine fungi reveal new enzyme diversity",
    venue: "Applied Microbiology",
    publicationDate: "2026-03-02",
    level: 2,
    panels: 4,
    summary: "Marine isolates carry unusually broad enzyme repertoires.",
    url: "https://example.com/article-8",
  },
  {
    id: 9,
    title: "Compost fungi speed lignin turnover",
    venue: "Bioresource Technology",
    publicationDate: "2026-03-01",
    level: 1,
    panels: 1,
    summary: "Mixed compost fungi accelerate woody residue breakdown.",
    url: "https://example.com/article-9",
  },
  {
    id: 10,
    title: "Forest fungi coordinate nutrient hotspots",
    venue: "New Phytologist",
    publicationDate: "2026-02-28",
    level: 3,
    panels: 2,
    summary: "Mycorrhizal fungi concentrate nutrient delivery in patchy forest soils.",
    url: "https://example.com/article-10",
  },
  {
    id: 11,
    title: "Fungal pigments improve UV resilience",
    venue: "Environmental Microbiology",
    publicationDate: "2026-02-27",
    level: 2,
    panels: 3,
    summary: "Pigmented fungal strains persist better under intense radiation.",
    url: "https://example.com/article-11",
  },
  {
    id: 12,
    title: "Root-associated fungi reduce salinity stress",
    venue: "Plant and Soil",
    publicationDate: "2026-02-26",
    level: 2,
    panels: 1,
    summary: "Root fungi improve water balance under saline irrigation.",
    url: "https://example.com/article-12",
  },
  {
    id: 13,
    title: "Fungal biocrusts improve desert retention",
    venue: "Arid Land Research",
    publicationDate: "2026-02-25",
    level: 1,
    panels: 2,
    summary: "Surface fungal mats help soils retain water after rare rainfall.",
    url: "https://example.com/article-13",
  },
  {
    id: 14,
    title: "Mycorrhiza rebalance phosphorus allocation",
    venue: "Nature Ecology",
    publicationDate: "2026-02-24",
    level: 2,
    panels: 2,
    summary: "Mycorrhiza alter phosphorus routing across competing plants.",
    url: "https://example.com/article-14",
  },
  {
    id: 15,
    title: "Fixture Article 15",
    venue: "Fungal Ecology",
    publicationDate: "2026-02-23",
    level: 1,
    panels: 1,
    summary: "A deterministic archive row reserved for page-two coverage.",
    url: "https://example.com/article-15",
  },
];

export const TEST_JUFO_ROWS: JufoRow[] = Array.from({ length: 55 }, (_, index) => {
  const rowNumber = index + 1;
  const publisher = rowNumber % 2 === 0 ? "Springer" : "Elsevier";
  const level = rowNumber % 2 === 0 ? 2 : 1;
  const name = `Fixture Publication ${String(rowNumber).padStart(2, "0")}`;
  const country = rowNumber % 3 === 0 ? "Finland" : "United Kingdom";
  const language = rowNumber % 5 === 0 ? "Finnish" : "English";
  const website = `https://example.com/jufo/${rowNumber}`;
  const panels = String((rowNumber % 4) + 1);

  return {
    id: rowNumber,
    name,
    publisher,
    level,
    website,
    country,
    language,
    yearStart: 1990 + rowNumber,
    panels,
    searchText: [name, publisher, country, language, website, String(level), panels]
      .join(" ")
      .toLowerCase(),
  };
});
