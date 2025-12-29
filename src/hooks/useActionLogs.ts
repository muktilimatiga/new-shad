// src/hooks/useActionLog.ts
import { toast } from "sonner";
import { useLogActivity } from '~/features/activity-log/activity.hooks';

type ActionSuccessOptions<T> = {
    title: string;
    action: string;
    target: string;
    getDetails?: (data: T) => unknown;
    onDone?: () => void;
};

export function useActionSuccess<T>() {
    // 1. Use the new Mutation Hook
    const { mutate: logActivity } = useLogActivity(); 

    return (value: T, options: ActionSuccessOptions<T>) => {
        const {
            title,
            action,
            target,
            getDetails,
            onDone,
        } = options;

        toast.success(`${title} Successful`);

        // 2. Call the mutation
        logActivity({
            action,
            target,
            status: "SUCCESS",
            details: JSON.stringify(getDetails ? getDetails(value) : value),
        });

        onDone?.();
    };
}

export function useActionError() {
    // 1. Use the new Mutation Hook
    const { mutate: logActivity } = useLogActivity();

    return (err: any, action: string, target: string) => { // Changed err to any/Error
        const errorMessage = err?.message || "Unknown error";
        
        toast.error(errorMessage || "Action Failed");

        // 2. Call the mutation
        logActivity({
            action,
            target,
            status: "ERROR",
            details: errorMessage,
        });
    };
}