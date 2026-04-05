import Image from "next/image";

import { Card } from "@/components/ui/card";
import { LANDSCAPE_BACKGROUND_IMAGES, pickDeterministicBackground } from "@/lib/public-data/backgrounds";
import type { NewsletterSummary } from "@/lib/public-data/types";

type NewsletterArchiveProps = {
  newsletters: NewsletterSummary[];
};

export function NewsletterArchive({ newsletters }: NewsletterArchiveProps) {
  if (newsletters.length === 0) {
    return <p className="text-center text-white/80">No newsletters available yet.</p>;
  }

  return (
    <div className="space-y-6">
      {newsletters.map((newsletter) => (
        <Card key={newsletter.id} className="relative overflow-hidden group h-48">
          <Image
            src={pickDeterministicBackground(newsletter.id, LANDSCAPE_BACKGROUND_IMAGES)}
            alt="Newsletter background"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
          <a
            href={newsletter.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 h-full p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Myco Newsletter</h2>
              <p className="text-white/90">
                Released {new Date(newsletter.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-white/40 text-white">
              View Newsletter →
            </span>
          </a>
        </Card>
      ))}
    </div>
  );
}
