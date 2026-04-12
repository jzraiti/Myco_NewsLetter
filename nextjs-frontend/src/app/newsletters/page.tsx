import Image from "next/image";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";
import { NewsletterArchive } from "@/components/newsletters/NewsletterArchive";
import { fetchPaginatedNewsletters } from "@/lib/public-data/content";

type NewslettersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildCanonicalNewslettersHref(page: number) {
  return page > 1 ? `/newsletters?page=${page}` : "/newsletters";
}

export default async function PreviousNewsletters({ searchParams }: NewslettersPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawPageValue = getSingleValue(resolvedSearchParams.page);
  const rawPage = rawPageValue ?? "1";
  const hasValidPageParam = rawPageValue == null || /^(?:[1-9]\d*)$/.test(rawPageValue);
  const parsedPage = Number.parseInt(rawPage, 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageResult = await fetchPaginatedNewsletters({ page: requestedPage });
  const canonicalHref = buildCanonicalNewslettersHref(pageResult.page);

  if (!hasValidPageParam || requestedPage !== pageResult.page) {
    redirect(canonicalHref);
  }

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/atik-sulianami-xwiO6w6XEiM-unsplash.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 " />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/15 bg-slate-950/38 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <h1 className="mb-6 flex items-center justify-center gap-4 text-center font-[family-name:var(--font-space)] text-4xl font-semibold text-white drop-shadow-lg sm:text-5xl">
            <Image
              src="/android-chrome-512x512.png"
              alt="Mushroom Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full shadow-lg"
            />
            Previous Newsletters
          </h1>
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.34em] text-white/58">
              Weekly archive
            </p>
            <p className="font-[family-name:var(--font-figtree)] text-base leading-7 text-white/84 sm:text-lg">
              Review past issues through the same shareable server-backed page URLs, now framed as a calmer reading archive.
            </p>
          </div>
        </section>
        <Separator className="bg-white/20" />
        <NewsletterArchive pageResult={pageResult} />
      </div>
    </Layout>
  );
}
