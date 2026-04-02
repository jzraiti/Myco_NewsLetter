import NextLink from "next/link";

export function Head({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Link({ children, href, ...props }: React.ComponentProps<typeof NextLink>) {
  return (
    <a href={typeof href === "string" ? href : href.toString()} {...props}>
      {children}
    </a>
  );
}
