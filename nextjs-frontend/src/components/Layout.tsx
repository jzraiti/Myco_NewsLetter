import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <TopBar />
      {children}
      <Footer />
    </div>
  );
}
