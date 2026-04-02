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

vi.mock("@/components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import Unsubscribe from "./page";

type UnsubscribeMockOptions = {
  updateData?: Array<{ email: string }>;
  updateError?: string | null;
};

function configureSupabaseMock(options: UnsubscribeMockOptions = {}) {
  const { updateData = [{ email: "user@example.com" }], updateError = null } = options;

  mockClient.from.mockImplementation((table: string) => {
    if (table !== "recipients") {
      throw new Error(`Unexpected table: ${table}`);
    }

    return {
      update: () => ({
        eq: (_field: string, _value: string) => ({
          select: () => Promise.resolve({ data: updateData, error: updateError }),
        }),
      }),
    };
  });
}

describe("Unsubscribe page", () => {
  beforeEach(() => {
    mockClient.from.mockReset();
  });

  it("shows success when an existing email is unsubscribed", async () => {
    configureSupabaseMock({ updateData: [{ email: "user@example.com" }] });

    render(<Unsubscribe />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    await userEvent.type(emailInput, "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /unsubscribe/i }));

    expect(await screen.findByText("Unsubscribed successfully!")).toBeInTheDocument();
    await waitFor(() => expect(emailInput).toHaveValue(""));
  });

  it("shows an error when the email is not found", async () => {
    configureSupabaseMock({ updateData: [] });

    render(<Unsubscribe />);

    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), "missing@example.com");
    await userEvent.click(screen.getByRole("button", { name: /unsubscribe/i }));

    expect(await screen.findByText("Email not found")).toBeInTheDocument();
  });
});
