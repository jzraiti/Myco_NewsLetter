import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full p-4 border-t mt-auto bg-white/80">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-4 text-sm text-gray-500">
        <span>© 2024 MycoWeekly. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/jzraiti/Myco_NewsLetter"
            className="hover:text-gray-600 inline-flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github_logo.svg"
              alt="GitHub"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>GitHub</span>
          </Link>
          <Link href="/unsubscribe" className="hover:text-gray-600">
            Unsubscribe
          </Link>
        </div>
      </div>
    </footer>
  );
}
