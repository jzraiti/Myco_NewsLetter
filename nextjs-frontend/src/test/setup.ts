import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.mock("server-only", () => ({}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

vi.mock("next/image", () => ({
  default: ({ alt, src, fill: _fill, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const resolvedSrc = typeof src === "string" ? src : src?.toString() ?? "";
    return React.createElement("img", { alt: alt ?? "", src: resolvedSrc, ...props });
  },
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement("div", props, children),
  },
}));
