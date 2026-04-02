import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    from: vi.fn(),
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockClient),
}));

vi.mock("next/head", async () => {
  const mocks = await import("@/test/mocks/next");
  return { default: mocks.Head };
});

vi.mock("next/link", async () => {
  const mocks = await import("@/test/mocks/next");
  return { default: mocks.Link };
});

vi.mock("@/components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import Home from "./page";

type HomeMockOptions = {
  subscriberCount?: number;
  existingUser?: { is_subscribed: boolean } | null;
  insertError?: string | null;
  updateError?: string | null;
};

function configureSupabaseMock(options: HomeMockOptions = {}) {
  const {
    subscriberCount = 42,
    existingUser = null,
    insertError = null,
    updateError = null,
  } = options;

  mockClient.from.mockImplementation((table: string) => {
    if (table !== "recipients") {
      throw new Error(`Unexpected table: ${table}`);
    }

    return {
      select: (_columns?: string, config?: { count?: string; head?: boolean }) => {
        if (config?.head) {
          return Promise.resolve({ count: subscriberCount, error: null });
        }

        return {
          eq: (_field: string, _value: string) => ({
            single: () => Promise.resolve({ data: existingUser, error: null }),
          }),
        };
      },
      insert: () => Promise.resolve({ error: insertError }),
      update: () => ({
        eq: () => Promise.resolve({ error: updateError }),
      }),
    };
  });
}

describe("Home page", () => {
  beforeEach(() => {
    mockClient.from.mockReset();
  });

  it("renders the mocked subscriber count in the hero copy", async () => {
    configureSupabaseMock({ subscriberCount: 128 });

    render(<Home />);

    expect(await screen.findByText("128")).toBeInTheDocument();
    expect(screen.getByText(/mycologists subscribed/i)).toBeInTheDocument();
  });

  it("shows an error when the email is already subscribed", async () => {
    configureSupabaseMock({ existingUser: { is_subscribed: true } });

    render(<Home />);

    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(await screen.findByText("You are already subscribed!")).toBeInTheDocument();
  });

  it("shows success when subscribing a new email", async () => {
    configureSupabaseMock({ existingUser: null });

    render(<Home />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    await userEvent.type(emailInput, "fresh@example.com");
    await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(await screen.findByText("Thanks for subscribing!")).toBeInTheDocument();
    await waitFor(() => expect(emailInput).toHaveValue(""));
  });
});
