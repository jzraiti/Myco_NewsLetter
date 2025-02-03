import Image from "next/image";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full p-4 border-b">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-bold flex items-center gap-2">
            <Image
              src="/mushroom_logo.jpg"
              alt="Mushroom Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            MycoWeekly
          </Link>
          <Link href="/newsletters" className="hover:text-gray-600">
            Previous Newsletters
          </Link>
          <Link href="/articles" className="hover:text-gray-600">
            Articles
          </Link>
        </div>
      </nav>
    </div>
  );
}
