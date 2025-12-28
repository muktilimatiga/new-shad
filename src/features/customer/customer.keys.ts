// src/features/customers/customers.keys.ts
export const customersKeys = {
  all: ["customers"] as const,
  view: (searchTerm: string) => [...customersKeys.all, "customers_view", { searchTerm }] as const,
};
