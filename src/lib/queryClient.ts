// src/lib/queryClient.ts
import { QueryClient, QueryCache } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_error, query) => {
      // only toast for customers queries (optional)
      if (query.queryKey[0] === "customers") {
        toast.error("Failed to fetch customers");
      }
    },
  }),
});
