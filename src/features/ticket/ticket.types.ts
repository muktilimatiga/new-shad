// src/features/customers/customers.types.ts
import type { Tables } from "~/database.types";

export type CustomerViewRow = Tables<"customers_view">;

// If you want a UI type with computed fields:
export type CustomerView = CustomerViewRow & {
  createdAt: string;
};
