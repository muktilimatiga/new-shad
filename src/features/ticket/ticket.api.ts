// src/features/customers/customers.api.ts
import { supabase } from "~/lib/supabase";
import type { LogKomplain, LogKomplainRow } from "./ticket.types";

export async function listKomplain(params: { searchTerm?: string; limit?: number } = {}) {
  const searchTerm = (params.searchTerm ?? "").trim();
  const limit = params.limit ?? 50;

  let query = supabase
    .from("log_komplain")
    .select("*")
    .order("id", { ascending: false });

  if (!searchTerm) {
    const res = await query.limit(limit).returns<LogKomplainRow[]>();
    if (res.error) throw res.error;

    return (res.data ?? []).map(mapRow);
  }

  const tokens = searchTerm.split(/\s+/).filter(Boolean);

  // Keep your existing OR-per-token behavior:
  for (const token of tokens) {
    query = query.or(
      `name.ilike.%${token}%,user_pppoe.ilike.%${token}%,alamat.ilike.%${token}%,onu_sn.ilike.%${token}%`
    );
  }

  const res = await query.returns<LogKomplainRow[]>();
  if (res.error) throw res.error;

  return (res.data ?? []).map(mapRow);
}

function mapRow(row: LogKomplainRow): LogKomplain {
  // Pick what you want as "createdAt"
  const createdAt =
    row.last_updated
      ? new Date(row.last_updated).toISOString()
      : new Date().toISOString();

  return { ...row, createdAt };
}
