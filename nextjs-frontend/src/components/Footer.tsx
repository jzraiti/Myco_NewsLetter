import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 backdrop-blur-md bg-white/10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 p-4 text-sm text-white/80">
        <span className="drop-shadow-sm">© 2024 MycoWeekly. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/jzraiti/Myco_NewsLetter"
            className="hover:text-white transition-colors duration-200 inline-flex items-center gap-2 drop-shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github_logo.svg"
              alt="GitHub"
              width={16}
              height={16}
              className="w-4 h-4 invert opacity-80 group-hover:opacity-100"
            />
            <span>GitHub</span>
          </Link>
          <Link 
            href="/unsubscribe" 
            className="hover:text-white transition-colors duration-200 drop-shadow-sm"
          >
            Unsubscribe
          </Link>
        </div>
      </div>
    </footer>
  );
}
