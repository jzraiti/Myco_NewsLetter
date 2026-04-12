import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { unsubscribeRecipient } = vi.hoisted(() => ({
  unsubscribeRecipient: vi.fn(),
}));

vi.mock("@/lib/public-data/subscriptions", () => ({
  unsubscribeRecipient,
}));

import { UnsubscribePanel } from "./UnsubscribePanel";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

describe("UnsubscribePanel", () => {
  it("requires a confirmation step before unsubscribe runs", async () => {
    render(<UnsubscribePanel />);

    await userEvent.type(screen.getByLabelText("Email address"), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Review unsubscribe" }));

    expect(screen.getByText("Confirm unsubscribe for user@example.com?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep subscription" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm unsubscribe" })).toBeInTheDocument();
    expect(unsubscribeRecipient).not.toHaveBeenCalled();
  });

  it("preserves the not-found message", async () => {
    unsubscribeRecipient.mockResolvedValueOnce({
      status: "not-found",
      message: "Email not found",
    });

    render(<UnsubscribePanel />);

    await userEvent.type(screen.getByLabelText("Email address"), "missing@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Review unsubscribe" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm unsubscribe" }));

    expect(await screen.findByText("Email not found")).toBeInTheDocument();
  });

  it("preserves the success message, loading state, and clears the email field", async () => {
    const deferred = createDeferred<{ status: "unsubscribed"; message: string }>();
    unsubscribeRecipient.mockReturnValueOnce(deferred.promise);

    render(<UnsubscribePanel />);

    const input = screen.getByLabelText("Email address");
    await userEvent.type(input, "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Review unsubscribe" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm unsubscribe" }));

    expect(screen.getByRole("button", { name: /unsubscribing/i })).toBeDisabled();
    deferred.resolve({ status: "unsubscribed", message: "Unsubscribed successfully!" });
    expect(await screen.findByText("Unsubscribed successfully!")).toBeInTheDocument();
    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("returns to the editable state without a network call", async () => {
    render(<UnsubscribePanel />);

    await userEvent.type(screen.getByLabelText("Email address"), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Review unsubscribe" }));
    await userEvent.click(screen.getByRole("button", { name: "Keep subscription" }));

    expect(screen.getByRole("button", { name: "Review unsubscribe" })).toBeInTheDocument();
    expect(unsubscribeRecipient).not.toHaveBeenCalled();
  });
});
