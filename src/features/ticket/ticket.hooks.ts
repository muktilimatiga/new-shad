// src/features/customers/customers.hooks.ts
import { useQuery } from "@tanstack/react-query";
import { ticketKeys } from "./ticket.keys";
import { listKomplain } from "./ticket.api";

export function useKomplainView(searchTerm: string = "") {
  const normalized = searchTerm.trim();

  return useQuery({
    queryKey: ticketKeys.view(normalized),
    queryFn: () => listKomplain({ searchTerm: normalized, limit: 50 }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
