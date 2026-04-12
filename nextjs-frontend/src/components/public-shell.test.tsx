import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("next/navigation", () => ({
  usePathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

import { Layout } from "./Layout";

describe("public shell", () => {
  it("renders a skip link targeting the shared main content container", () => {
    usePathname.mockReturnValue("/");

    const { container } = render(
      <Layout>
        <section>Route content</section>
      </Layout>,
    );

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });

    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(container.firstElementChild?.firstElementChild).toBe(skipLink);
    expect(document.getElementById("main-content")).toBeInTheDocument();
  });

  it("marks the active primary route with aria-current", () => {
    usePathname.mockReturnValue("/articles");

    render(
      <Layout>
        <section>Route content</section>
      </Layout>,
    );

    const articlesLink = screen.getByRole("link", { name: "Articles" });
    const newslettersLink = screen.getByRole("link", { name: "Newsletters" });
    const jufoLink = screen.getByRole("link", { name: "JUFO Rankings" });

    expect(articlesLink).toHaveAttribute("aria-current", "page");
    expect(newslettersLink).not.toHaveAttribute("aria-current");
    expect(jufoLink).not.toHaveAttribute("aria-current");
  });

  it("preserves footer support links after shared layout polish", () => {
    usePathname.mockReturnValue("/articles");

    render(
      <Layout>
        <section>Route content</section>
      </Layout>,
    );

    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByRole("link", { name: "Our Team" })).toHaveAttribute("href", "/ourteam");
    expect(within(footer).getByRole("link", { name: "Unsubscribe" })).toHaveAttribute("href", "/unsubscribe");
    expect(within(footer).getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/jzraiti/Myco_NewsLetter",
    );
  });
});
