// src/features/customers/customers.keys.ts
export const ticketKeys = {
  all: ["komplain"] as const,
  view: (searchTerm: string) => [...ticketKeys.all, "log_komplain", { searchTerm }] as const,
};
