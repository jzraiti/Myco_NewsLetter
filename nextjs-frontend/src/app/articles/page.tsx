import Image from "next/image";
import { redirect } from "next/navigation";

import { ArticlesExplorer } from "@/components/articles/ArticlesExplorer";
import { Layout } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { fetchPaginatedArticles } from "@/lib/public-data/content";

type ArticlesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildCanonicalArticlesHref(page: number, query: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return queryString ? `/articles?${queryString}` : "/articles";
}

export default async function Articles({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawQueryValue = getSingleValue(resolvedSearchParams.q);
  const rawQuery = rawQueryValue ?? "";
  const trimmedQuery = rawQuery.trim();
  const rawPageValue = getSingleValue(resolvedSearchParams.page);
  const rawPage = rawPageValue ?? "1";
  const hasValidPageParam = rawPageValue == null || /^(?:[1-9]\d*)$/.test(rawPageValue);
  const parsedPage = Number.parseInt(rawPage, 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageResult = await fetchPaginatedArticles({ query: trimmedQuery, page: requestedPage });
  const canonicalHref = buildCanonicalArticlesHref(pageResult.page, pageResult.query);
  const queryNeedsNormalization = rawQueryValue != null && rawQueryValue !== trimmedQuery;

  if (!hasValidPageParam || queryNeedsNormalization || requestedPage !== pageResult.page) {
    redirect(canonicalHref);
  }

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: "url('/backgrounds/alexx-cooper-VB3cvKx9-Hc-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-white/15 bg-slate-950/38 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <h1 className="mb-6 flex items-center justify-center gap-4 text-center font-[family-name:var(--font-space)] text-4xl font-semibold text-white drop-shadow-lg sm:text-5xl">
              <Image
                src="/android-chrome-512x512.png"
                alt="Mushroom Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full shadow-lg"
              />
                Research Articles
              </h1>
              <div className="mx-auto max-w-3xl space-y-3 text-center">
                <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.34em] text-white/58">
                  Curated archive
                </p>
                <p className="font-[family-name:var(--font-figtree)] text-base leading-7 text-white/84 sm:text-lg">
                  Search concise summaries from the archive without leaving the shareable, server-backed article URL flow introduced in Phase 6.
                </p>
              </div>
            </section>

            <Separator className="bg-white/20" />

            <ArticlesExplorer pageResult={pageResult} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
