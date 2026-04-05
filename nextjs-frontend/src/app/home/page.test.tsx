import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { fetchSubscriberCount, pickDeterministicBackground, HOME_BACKGROUND_IMAGES } = vi.hoisted(() => ({
  fetchSubscriberCount: vi.fn(),
  pickDeterministicBackground: vi.fn(),
  HOME_BACKGROUND_IMAGES: ["/background-a.jpg", "/background-b.jpg"] as const,
}));

vi.mock("@/components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/subscription/SubscribePanel", () => ({
  SubscribePanel: ({
    initialSubscriberCount,
    backgroundImage,
    preloadImages,
  }: {
    initialSubscriberCount: number;
    backgroundImage: string;
    preloadImages: readonly string[];
  }) => (
    <div>
      <span data-testid="subscriber-count">{initialSubscriberCount}</span>
      <span data-testid="background-image">{backgroundImage}</span>
      <span data-testid="preload-count">{preloadImages.length}</span>
    </div>
  ),
}));

vi.mock("@/lib/public-data/subscriptions", () => ({
  fetchSubscriberCount,
}));

vi.mock("@/lib/public-data/backgrounds", () => ({
  HOME_BACKGROUND_IMAGES,
  pickDeterministicBackground,
}));

import Home from "./page";

describe("Home page", () => {
  it("renders the fetched subscriber count through the server wrapper", async () => {
    fetchSubscriberCount.mockResolvedValueOnce(128);
    pickDeterministicBackground.mockReturnValueOnce("/background-a.jpg");

    render(await Home());

    expect(fetchSubscriberCount).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("subscriber-count")).toHaveTextContent("128");
  });

  it("passes the deterministic hero image and preload catalog into the subscribe panel", async () => {
    fetchSubscriberCount.mockResolvedValueOnce(64);
    pickDeterministicBackground.mockReturnValueOnce("/background-b.jpg");

    render(await Home());

    expect(pickDeterministicBackground).toHaveBeenCalledWith("home-hero", HOME_BACKGROUND_IMAGES);
    expect(screen.getByTestId("background-image")).toHaveTextContent("/background-b.jpg");
    expect(screen.getByTestId("preload-count")).toHaveTextContent(String(HOME_BACKGROUND_IMAGES.length));
  });
});
