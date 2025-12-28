// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isBrowser = typeof window !== "undefined";

if (isBrowser && (!url || !anon)) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(
  url ?? "https://placeholder-project.supabase.co",
  anon ?? "placeholder-key"
);
