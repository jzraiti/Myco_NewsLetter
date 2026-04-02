import Link from "next/link";

export function Head({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function MockLink({ children, href, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <a href={typeof href === "string" ? href : href.toString()} {...props}>
      {children}
    </a>
  );
}
