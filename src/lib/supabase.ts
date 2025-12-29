// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const isBrowser = typeof window !== "undefined";

if (isBrowser && (!supabaseUrl || !supabaseKey)) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
}

export const supabase = createClient<Database>(
  supabaseUrl ?? "https://placeholder-project.supabase.co",
  supabaseKey ?? "placeholder-key"
);
