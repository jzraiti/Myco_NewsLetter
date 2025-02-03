import Image from "next/image";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full border-b border-white/10 backdrop-blur-md bg-white/10">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-10">
          <Link 
            href="/" 
            className="font-bold flex items-center gap-2 text-white drop-shadow-lg transition-transform hover:scale-105"
          >
            <Image
              src="/mushroom_logo.jpg"
              alt="Mushroom Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full shadow-lg"
            />
            MycoWeekly
          </Link>
          <div className="flex gap-6">
            <Link 
              href="/newsletters" 
              className="text-white/90 hover:text-white transition-colors duration-200 drop-shadow-sm"
            >
              Previous Newsletters
            </Link>
            <Link 
              href="/articles" 
              className="text-white/90 hover:text-white transition-colors duration-200 drop-shadow-sm"
            >
              Articles
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
