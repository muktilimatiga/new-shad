// src/features/customers/customers.hooks.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { activityKeys } from "./activity.keys";
import { createActivityLog, ListActivity, type ActivityLogPayload } from "./activity.api";
import { toast } from "sonner";

export function useActivityLogger(searchTerm: string = "") {
  const normalized = searchTerm.trim();

  return useQuery({
    queryKey: activityKeys.view(normalized),
    queryFn: () => ListActivity({ searchTerm: normalized, limit: 50 }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}


export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ActivityLogPayload) => createActivityLog(payload),
    
    // On success, refresh the activity list automatically
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      toast.success("Activity logged successfully");
    },
    
    onError: (error) => {
      toast.error("Failed to log activity");
      console.error("Failed to log activity:", error);
    }
  });
}