import { describe, expect, it, vi } from "vitest";

import { subscribeRecipient, unsubscribeRecipient } from "./subscriptions";

function createRecipientsClient(options: {
  existingUser?: { is_subscribed: boolean } | null;
  insertError?: { message: string } | null;
  updateError?: { message: string } | null;
  unsubscribeRows?: Array<{ email: string }>;
}) {
  const {
    existingUser = null,
    insertError = null,
    updateError = null,
    unsubscribeRows = [{ email: "user@example.com" }],
  } = options;

  return {
    from: vi.fn(() => ({
      select: (_columns?: string, config?: { count?: "exact"; head?: boolean }) => {
        if (config?.head) {
          return Promise.resolve({ count: 12, error: null });
        }

        return {
          eq: () => ({
            single: () => Promise.resolve({ data: existingUser, error: null }),
          }),
        };
      },
      insert: () => Promise.resolve({ error: insertError }),
      update: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: unsubscribeRows, error: updateError }),
        }),
      }),
    })),
  };
}

describe("subscription helpers", () => {
  it("returns already-subscribed with the existing message", async () => {
    const client = createRecipientsClient({ existingUser: { is_subscribed: true } });

    await expect(subscribeRecipient("user@example.com", client as any)).resolves.toEqual({
      status: "already-subscribed",
      message: "You are already subscribed!",
    });
  });

  it("returns subscribed for new recipients", async () => {
    const client = createRecipientsClient({ existingUser: null });

    await expect(subscribeRecipient("fresh@example.com", client as any)).resolves.toEqual({
      status: "subscribed",
      message: "Thanks for subscribing!",
    });
  });

  it("returns unsubscribed for successful unsubscribe updates", async () => {
    const client = createRecipientsClient({ unsubscribeRows: [{ email: "user@example.com" }] });

    await expect(unsubscribeRecipient("user@example.com", client as any)).resolves.toEqual({
      status: "unsubscribed",
      message: "Unsubscribed successfully!",
    });
  });

  it("returns not-found when unsubscribe updates no rows", async () => {
    const client = createRecipientsClient({ unsubscribeRows: [] });

    await expect(unsubscribeRecipient("missing@example.com", client as any)).resolves.toEqual({
      status: "not-found",
      message: "Email not found",
    });
  });
});
