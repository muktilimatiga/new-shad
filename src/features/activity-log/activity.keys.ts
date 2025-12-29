// src/features/customers/customers.keys.ts
export const activityKeys = {
  all: ["activity"] as const,
  view: (searchTerm: string) => [...activityKeys.all, "log_activity", { searchTerm }] as const,
};
