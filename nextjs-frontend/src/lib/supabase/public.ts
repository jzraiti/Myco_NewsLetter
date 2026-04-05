import { createClient } from "@supabase/supabase-js";

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export function createPublicServerClient() {
  return createPublicClient();
}

export function createPublicBrowserClient() {
  return createPublicClient();
}
