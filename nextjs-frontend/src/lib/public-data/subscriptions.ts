import { createPublicBrowserClient, createPublicServerClient } from "@/lib/supabase/public";

import type { RecipientLookupRow, SubscriptionMutationResult } from "./types";

type CountSelectResult = Promise<{ count: number | null; error: { message: string } | null }>;
type SingleLookupResult = Promise<{
  data: RecipientLookupRow | null;
  error: { code?: string; message: string } | null;
}>;
type MutationResult = Promise<{ error: { message: string } | null }>;
type UpdateSelectResult = Promise<{
  data: Array<{ email: string }> | null;
  error: { message: string } | null;
}>;

type RecipientsTable = {
  select: (columns?: string, config?: { count?: "exact"; head?: boolean }) =>
    | CountSelectResult
    | {
        eq: (field: string, value: string) => {
          single: () => SingleLookupResult;
        };
      };
  insert: (rows: Array<{ email: string; is_subscribed: boolean }>) => MutationResult;
  update: (values: { is_subscribed: boolean }) => {
    eq: (field: string, value: string) => MutationResult | { select: () => UpdateSelectResult };
  };
};

type PublicSubscriptionsClient = {
  from: (table: "recipients") => RecipientsTable;
};

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again later.";

export async function fetchSubscriberCount(
  client: PublicSubscriptionsClient = createPublicServerClient(),
): Promise<number> {
  const result = await client.from("recipients").select("*", { count: "exact", head: true });
  if (!("count" in result) || result.error) {
    return 0;
  }

  return result.count ?? 0;
}

export async function subscribeRecipient(
  email: string,
  client: PublicSubscriptionsClient = createPublicBrowserClient(),
): Promise<SubscriptionMutationResult> {
  try {
    const lookup = client.from("recipients").select("is_subscribed");
    if ("count" in lookup) {
      return { status: "error", message: GENERIC_ERROR_MESSAGE };
    }

    const { data: existingUser, error: lookupError } = await lookup.eq("email", email).single();

    if (lookupError && lookupError.code !== "PGRST116") {
      throw new Error(lookupError.message);
    }

    if (existingUser) {
      if (existingUser.is_subscribed) {
        return { status: "already-subscribed", message: "You are already subscribed!" };
      }

      const updateResult = client.from("recipients").update({ is_subscribed: true }).eq("email", email);
      const { error: updateError } = "error" in updateResult ? await updateResult : await updateResult.select();
      if (updateError) {
        throw new Error(updateError.message);
      }

      return { status: "subscribed", message: "Thanks for subscribing!" };
    }

    const { error: insertError } = await client
      .from("recipients")
      .insert([{ email, is_subscribed: true }]);

    if (insertError) {
      throw new Error(insertError.message);
    }

    return { status: "subscribed", message: "Thanks for subscribing!" };
  } catch {
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }
}

export async function unsubscribeRecipient(
  email: string,
  client: PublicSubscriptionsClient = createPublicBrowserClient(),
): Promise<SubscriptionMutationResult> {
  try {
    const updateResult = client
      .from("recipients")
      .update({ is_subscribed: false })
      .eq("email", email);

    const response = "select" in updateResult ? await updateResult.select() : await updateResult;

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!("data" in response) || !response.data || response.data.length === 0) {
      return { status: "not-found", message: "Email not found" };
    }

    return { status: "unsubscribed", message: "Unsubscribed successfully!" };
  } catch {
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }
}
