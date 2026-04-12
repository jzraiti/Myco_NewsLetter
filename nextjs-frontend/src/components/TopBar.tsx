"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/newsletters", label: "Newsletters" },
  { href: "/articles", label: "Articles" },
  { href: "/jufo", label: "JUFO Rankings" },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-white/15 bg-slate-950/35 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
            <Link
              href="/"
              className="group flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-white shadow-lg shadow-black/20 transition hover:bg-white/16 focus:outline-none focus:ring-4 focus:ring-ring/70"
            >
              <Image
                src="/mushroom_logo.jpg"
                alt="Mushroom Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-white/20 object-cover shadow-md"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-[family-name:var(--font-space)] text-sm uppercase tracking-[0.28em] text-white/65">
                  Mycology Digest
                </span>
                <span className="font-[family-name:var(--font-figtree)] text-lg font-semibold text-white">
                  MycoWeekly
                </span>
              </span>
            </Link>

            <Link
              href="https://madisonmycologicalsociety.com/"
              className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm font-medium text-white/82 transition hover:bg-black/30 hover:text-white focus:outline-none focus:ring-4 focus:ring-ring/70"
            >
              <Image
                src="/mms-logo.png"
                alt="Madison Mycological Society"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-white/15 bg-white/10 object-cover"
              />
              <span className="leading-tight">
                Madison Mycological Society
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {primaryLinks.map((link) => {
              const isCurrent = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={[
                    "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold tracking-[0.01em] transition focus:outline-none focus:ring-4 focus:ring-ring/70",
                    isCurrent
                      ? "border-[#8FAF6B]/75 bg-[#8FAF6B]/20 text-white shadow-lg shadow-black/20"
                      : "border-white/10 bg-white/8 text-white/88 hover:border-white/20 hover:bg-white/14 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <p className="max-w-3xl pl-1 font-[family-name:var(--font-figtree)] text-sm leading-6 text-white/72">
          Clear weekly access to mycology research, previous newsletters, and publication rankings.
        </p>
      </nav>
    </div>
  );
}
