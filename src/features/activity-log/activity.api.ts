// src/features/customers/customers.api.ts
import { supabase } from "~/lib/supabase";
import type { LogActivity, LogActivityRow } from "./activity.types";


export type ActivityLogPayload = {
  action: string;
  target: string;
  status: "SUCCESS" | "ERROR";
  details?: string;
};

export async function ListActivity(params: { searchTerm?: string; limit?: number } = {}) {
  const searchTerm = (params.searchTerm ?? "").trim();
  const limit = params.limit ?? 50;

  let query = supabase
    .from("log_activity")
    .select("*")
    .order("id", { ascending: false });

  if (!searchTerm) {
    const res = await query.limit(limit).returns<LogActivityRow[]>();
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

  const res = await query.returns<LogActivityRow[]>();
  if (res.error) throw res.error;

  return (res.data ?? []).map(mapRow);
}

export async function createActivityLog(payload: ActivityLogPayload) {
  const { data, error } = await supabase
    .from("log_activity")
    .insert([{
      // 1. Direct fields
      action: payload.action,
      target: payload.target,
      details: payload.details,

      // 2. FIX: Map 'timestamp' to the DB column 'created_at'
      created_at: new Date().toISOString(),

      // 3. FIX: Map string status to boolean (since your DB expects boolean)
      // If you want to store text, you must change the column type in Supabase to 'text'
      status: payload.status === "SUCCESS", 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

function mapRow(row: LogActivityRow): LogActivity {
  const createdAt =
    row.created_at
      ? new Date(row.created_at).toISOString()
      : new Date().toISOString();

  return { ...row, createdAt };
}
