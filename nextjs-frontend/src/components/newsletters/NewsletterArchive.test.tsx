import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NewsletterArchive } from "./NewsletterArchive";

describe("NewsletterArchive", () => {
  it("renders newsletter cards in the provided newest-first order", () => {
    render(
      <NewsletterArchive
        newsletters={[
          { id: 2, createdAt: "2026-03-08", link: "https://example.com/newer" },
          { id: 1, createdAt: "2026-03-01", link: "https://example.com/older" },
        ]}
      />,
    );

    const releasedDates = screen.getAllByText(/Released/i);
    expect(releasedDates[0]).toHaveTextContent("Released");
    expect(releasedDates[1]).toHaveTextContent("Released");
    expect(new Date(releasedDates[0].textContent!.replace("Released ", ""))).toBeTruthy();
  });

  it("renders the View Newsletter CTA for each item", () => {
    render(
      <NewsletterArchive
        newsletters={[{ id: 1, createdAt: "2026-03-08", link: "https://example.com/newer" }]}
      />,
    );

    expect(screen.getByRole("link", { name: /view newsletter/i })).toBeInTheDocument();
  });

  it("uses deterministic backgrounds per newsletter id instead of Math.random", () => {
    const { container } = render(
      <NewsletterArchive
        newsletters={[
          { id: 1, createdAt: "2026-03-08", link: "https://example.com/newer" },
          { id: 1, createdAt: "2026-03-08", link: "https://example.com/repeat" },
        ]}
      />,
    );

    const imageSources = Array.from(container.querySelectorAll('img[alt="Newsletter background"]')).map(
      (image) => image.getAttribute("src"),
    );

    expect(imageSources[0]).toBe(imageSources[1]);
  });
});
