import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-full border border-white/30 bg-slate-950/95 px-4 py-3 text-sm font-semibold text-white shadow-lg transition focus:not-sr-only focus:outline-none focus:ring-4 focus:ring-ring/70"
      >
        Skip to main content
      </a>
      <TopBar />
      <main id="main-content" className="relative flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
