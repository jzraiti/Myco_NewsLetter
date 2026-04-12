import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/12 bg-slate-950/35 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 text-sm text-white/78 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/55">
            MycoWeekly
          </p>
          <span className="block text-sm text-white/60">© 2026 MycoWeekly. All rights reserved.</span>
        </div>

        <div className="space-y-1">
          <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/55">
            App
          </p>
          <div className="flex flex-col items-start gap-0.5">
            <Link href="/ourteam" className="inline-flex items-center rounded-full px-2 py-1 text-white/82 transition hover:text-white focus:outline-none focus:ring-4 focus:ring-ring/70">
              Our Team
            </Link>
            <Link href="/unsubscribe" className="inline-flex items-center rounded-full px-2 py-1 text-white/82 transition hover:text-white focus:outline-none focus:ring-4 focus:ring-ring/70">
              Unsubscribe
            </Link>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.3em] text-white/55">
            Support
          </p>
          <Link
            href="https://github.com/jzraiti/Myco_NewsLetter"
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-white/82 transition hover:text-white focus:outline-none focus:ring-4 focus:ring-ring/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github_logo.svg"
              alt="GitHub"
              width={16}
              height={16}
              className="h-4 w-4 invert opacity-80"
            />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
