// src/features/customers/customers.api.ts
import { supabase } from "~/lib/supabase";
import type { CustomerView, CustomerViewRow } from './customer.types'

export async function listCustomersView(params: { searchTerm?: string; limit?: number } = {}) {
  const searchTerm = (params.searchTerm ?? "").trim();
  const limit = params.limit ?? 50;

  console.log("[DEBUG] listCustomersView called with searchTerm:", searchTerm);

  let query = supabase
    .from("customers_view")
    .select("*")
    .order("user_pppoe", { ascending: false });

  if (!searchTerm) {
    console.log("[DEBUG] No search term, returning default results");
    const res = await query.limit(limit).returns<CustomerViewRow[]>();
    if (res.error) throw res.error;

    return (res.data ?? []).map(mapRow);
  }

  // Build search: Each token must match somewhere (AND between tokens)
  // Each token can match any field (OR within each token)
  const tokens = searchTerm.split(/\s+/).filter(Boolean);
  console.log("[DEBUG] Search tokens:", tokens);

  // Build OR filter for each token and combine with AND
  for (const token of tokens) {
    const orFilter = `nama.ilike.%${token}%,user_pppoe.ilike.%${token}%,alamat.ilike.%${token}%,onu_sn.ilike.%${token}%`;
    console.log("[DEBUG] Applying OR filter:", orFilter);
    query = query.or(orFilter);
  }

  const res = await query.limit(limit).returns<CustomerViewRow[]>();
  console.log("[DEBUG] Query result count:", res.data?.length, "error:", res.error);
  if (res.error) throw res.error;

  return (res.data ?? []).map(mapRow);
}

function mapRow(row: CustomerViewRow): CustomerView {
  // Pick what you want as "createdAt"
  const createdAt =
    row.latest_kendala_at
      ? new Date(row.latest_kendala_at).toISOString()
      : new Date().toISOString();

  return {
    ...row,
    id: (row as any).customer_id,
    nama: (row as any).nama,
    interface: (row as any).interface,
    createdAt
  };
}
