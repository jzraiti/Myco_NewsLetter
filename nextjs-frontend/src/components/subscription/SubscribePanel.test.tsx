import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { subscribeRecipient } = vi.hoisted(() => ({
  subscribeRecipient: vi.fn(),
}));

vi.mock("next/head", async () => {
  const mocks = await import("@/test/mocks/next");
  return { default: mocks.Head };
});

vi.mock("next/link", async () => {
  const mocks = await import("@/test/mocks/next");
  return { default: mocks.Link };
});

vi.mock("@/lib/public-data/subscriptions", () => ({
  subscribeRecipient,
}));

import { SubscribePanel } from "./SubscribePanel";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

describe("SubscribePanel", () => {
  it("uses the updated CTA copy and accessible email label", () => {
    render(
      <SubscribePanel
        initialSubscriberCount={128}
        backgroundImage="/backgrounds/example.jpg"
        preloadImages={["/backgrounds/example.jpg"]}
      />,
    );

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe Free" })).toBeInTheDocument();
    expect(screen.getByText("Free weekly roundup. No spam. Unsubscribe anytime.")).toBeInTheDocument();
  });

  it("preserves the already-subscribed message", async () => {
    subscribeRecipient.mockResolvedValueOnce({
      status: "already-subscribed",
      message: "You are already subscribed!",
    });

    render(
      <SubscribePanel
        initialSubscriberCount={128}
        backgroundImage="/backgrounds/example.jpg"
        preloadImages={["/backgrounds/example.jpg"]}
      />,
    );

    await userEvent.type(screen.getByLabelText("Email address"), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe free/i }));

    expect(await screen.findByText("You are already subscribed!")).toBeInTheDocument();
  });

  it("preserves the success message and clears the email field", async () => {
    const deferred = createDeferred<{ status: "subscribed"; message: string }>();
    subscribeRecipient.mockReturnValueOnce(deferred.promise);

    render(
      <SubscribePanel
        initialSubscriberCount={64}
        backgroundImage="/backgrounds/example.jpg"
        preloadImages={["/backgrounds/example.jpg"]}
      />,
    );

    const input = screen.getByLabelText("Email address");
    await userEvent.type(input, "fresh@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe free/i }));

    expect(screen.getByRole("button", { name: /subscribing/i })).toBeDisabled();
    deferred.resolve({ status: "subscribed", message: "Thanks for subscribing!" });
    expect(await screen.findByText("Thanks for subscribing!")).toBeInTheDocument();
    await waitFor(() => expect(input).toHaveValue(""));
  });
});
