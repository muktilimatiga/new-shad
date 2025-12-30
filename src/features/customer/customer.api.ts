// src/features/customers/customers.api.ts
import { supabase } from "~/lib/supabase";
import type { CustomerView, CustomerViewRow } from './customer.types'

export async function listCustomersView(params: { searchTerm?: string; limit?: number } = {}) {
  const searchTerm = (params.searchTerm ?? "").trim();
  const limit = params.limit ?? 50;

  let query = supabase
    .from("customers_view")
    .select("*")
    .order("nama", { ascending: false });

  if (!searchTerm) {
    const res = await query.limit(limit).returns<CustomerViewRow[]>();
    if (res.error) throw res.error;

    return (res.data ?? []).map(mapRow);
  }

  const tokens = searchTerm.split(/\s+/).filter(Boolean);

  // Keep your existing OR-per-token behavior:
  for (const token of tokens) {
    query = query.or(
      `nama.ilike.%${token}%,user_pppoe.ilike.%${token}%,alamat.ilike.%${token}%,onu_sn.ilike.%${token}%`
    );
  }

  const res = await query.returns<CustomerViewRow[]>();
  if (res.error) throw res.error;

  return (res.data ?? []).map(mapRow);
}

function mapRow(row: CustomerViewRow): CustomerView {
  // Pick what you want as "createdAt"
  const createdAt =
    row.latest_kendala_at
      ? new Date(row.latest_kendala_at).toISOString()
      : new Date().toISOString();

  return { ...row, createdAt };
}
