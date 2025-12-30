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
    enabled: normalized.length >= 2, // Only fetch when search term has at least 2 characters
  });
}
