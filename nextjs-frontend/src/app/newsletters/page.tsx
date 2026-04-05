import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";
import { NewsletterArchive } from "@/components/newsletters/NewsletterArchive";
import { fetchPublishedNewsletters } from "@/lib/public-data/content";

export default async function PreviousNewsletters() {
  const newsletters = await fetchPublishedNewsletters();

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
          Browse through our archive of past newsletters. Each newsletter is
          sent out weekly and contains a curated list of top research articles.
        </p>
        <Separator className="mb-6 bg-white/20" />
        <NewsletterArchive newsletters={newsletters} />
      </div>
    </Layout>
  );
}
