// src/hooks/useActionLog.ts
import { toast } from "sonner";
import { useLogActivity } from '~/features/activity-log/activity.hooks';
import { useAppStore } from '~/hooks/store';

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
    const addNotification = useAppStore((s) => s.addNotification);

    return (value: T, options: ActionSuccessOptions<T>) => {
        const {
            title,
            action,
            target,
            getDetails,
            onDone,
        } = options;

        toast.success(`${title} Successful`);

        // Push to notification dropdown
        addNotification({
            title: `${title} Successful`,
            message: `${action} on ${target} completed successfully.`,
            type: 'success',
        });

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
    const addNotification = useAppStore((s) => s.addNotification);

    return (err: any, action: string, target: string) => { // Changed err to any/Error
        const errorMessage = err?.message || "Unknown error";

        toast.error(errorMessage || "Action Failed");

        // Push to notification dropdown
        addNotification({
            title: `${action} on ${target} Failed`,
            message: errorMessage,
            type: 'error',
        });

        // 2. Call the mutation
        logActivity({
            action,
            target,
            status: "ERROR",
            details: errorMessage,
        });
    };
}