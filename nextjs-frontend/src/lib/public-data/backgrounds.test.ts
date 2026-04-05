import { describe, expect, it } from "vitest";

import { HOME_BACKGROUND_IMAGES, pickDeterministicBackground } from "./backgrounds";

describe("background helpers", () => {
  it("returns the same image for the same key", () => {
    const first = pickDeterministicBackground("home-hero", HOME_BACKGROUND_IMAGES);
    const second = pickDeterministicBackground("home-hero", HOME_BACKGROUND_IMAGES);

    expect(first).toBe(second);
  });
});
