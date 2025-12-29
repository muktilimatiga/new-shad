// src/features/customers/customers.types.ts
import type { Tables } from "~/database.types";

export type LogActivityRow = Tables<"log_activity">;

// If you want a UI type with computed fields:
export type LogActivity = LogActivityRow & {
  createdAt: string;
};
