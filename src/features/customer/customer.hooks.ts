// src/features/customers/customers.hooks.ts
import { useQuery } from "@tanstack/react-query";
import { customersKeys } from "./customer.keys";
import { listCustomersView } from "./customer.api";

export function useCustomersView(searchTerm: string = "") {
  const normalized = searchTerm.trim();

  return useQuery({
    queryKey: customersKeys.view(normalized),
    queryFn: () => listCustomersView({ searchTerm: normalized, limit: 50 }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    // Fetch on initial load (empty) OR when search has 2+ chars (debounced typing)
    enabled: normalized.length === 0 || normalized.length >= 2,
  });
}
