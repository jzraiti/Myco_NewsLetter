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

      <div className="flex flex-col p-6 max-w-5xl mx-auto flex-1">
        <h1 className="text-4xl font-bold text-center mt-10 mb-8 flex items-center justify-center gap-4 text-white drop-shadow-lg">
          <Image
            src="/android-chrome-512x512.png"
            alt="Mushroom Logo"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full shadow-lg"
          />
          Previous Newsletters
        </h1>
        <p className="text-center text-white/90 mb-4 drop-shadow-sm font-body">
          Browse through our archive of past newsletters. Each newsletter is sent out weekly and contains
          a curated list of top research articles.
        </p>
        <Separator className="mb-6 bg-white/20" />
        <NewsletterArchive pageResult={pageResult} />
      </div>
    </Layout>
  );
}
