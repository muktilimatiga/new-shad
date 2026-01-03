import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { type LucideIcon, Loader2 } from 'lucide-react'
import { useActionStore, useActionExecutor, type ActionMode } from '~/store/actionStore'
import { ActionResultDialog, useActionResultDialog } from '~/components/ActionResultDialog'
import { toast } from 'sonner'

// ============================================
// TYPES
// ============================================

export type ActionMenuItemProps = {
    icon: LucideIcon
    label: string
    onClick: () => void
    destructive?: boolean
    loading?: boolean
}

export type ActionDropdownItemProps = {
    icon: LucideIcon
    label: string
    mode: ActionMode
    oltName: string
    interface: string
    onuSn?: string
    destructive?: boolean
    showResultDialog?: boolean
    onSuccess?: (result: any) => void
    onError?: (error: Error) => void
}

// ============================================
// BASIC ACTION MENU ITEM
// ============================================

export function ActionMenuItem({
    icon: Icon,
    label,
    onClick,
    destructive,
    loading
}: ActionMenuItemProps) {
    return (
        <DropdownMenuItem
            onClick={onClick}
            variant={destructive ? 'destructive' : 'default'}
            className="gap-2 py-1.5 text-sm"
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Icon className="h-4 w-4" />
            )}
            <span>{label}</span>
        </DropdownMenuItem>
    )
}

// ============================================
// ACTION DROPDOWN ITEM (Integrated with Store + Dialog)
// ============================================

export function ActionDropdownItem({
    icon: Icon,
    label,
    mode,
    oltName,
    interface: iface,
    onuSn,
    destructive,
    showResultDialog = true,
    onSuccess,
    onError,
}: ActionDropdownItemProps) {
    const { addToQueue } = useActionStore()
    const { executeCek, executeReboot, isCekLoading, isRebootLoading } = useActionExecutor()
    const { dialogState, showResult, showLoading, setOpen } = useActionResultDialog()

    const isLoading = mode === 'reboot' ? isRebootLoading : isCekLoading

    const handleClick = async () => {
        // Add to queue for tracking
        addToQueue({
            mode,
            oltName,
            interface: iface,
            onuSn,
        })

        // Show loading dialog if enabled
        if (showResultDialog) {
            showLoading(mode, label)
        }

        try {
            let result

            switch (mode) {
                case 'cek':
                case 'cek-redaman':
                case 'cek-detail-port':
                case 'cek-redaman-1-port':
                    result = await executeCek(oltName, {
                        interface: iface,
                        olt_name: oltName,
                    })
                    break

                case 'reboot':
                    result = await executeReboot(oltName, { interface: iface })
                    break

                case 'no-onu':
                    toast.info(`No ONU action untuk ${oltName}`)
                    if (showResultDialog) {
                        showResult({ result: 'No ONU action completed', mode })
                    }
                    return

                default:
                    throw new Error(`Unknown action mode: ${mode}`)
            }

            // Show result dialog
            if (showResultDialog) {
                showResult({ result, mode, title: label })
            } else {
                toast.success(`${label} berhasil!`)
            }

            onSuccess?.(result)
        } catch (error: any) {
            if (showResultDialog) {
                showResult({ error: error.message, mode, title: label })
            } else {
                toast.error(error.message || 'Action failed')
            }
            onError?.(error)
        }
    }

    return (
        <>
            <DropdownMenuItem
                onClick={handleClick}
                variant={destructive ? 'destructive' : 'default'}
                className="gap-2 py-1.5 text-sm"
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Icon className="h-4 w-4" />
                )}
                <span>{label}</span>
            </DropdownMenuItem>

            {/* Result Dialog */}
            {showResultDialog && (
                <ActionResultDialog
                    open={dialogState.open}
                    onOpenChange={setOpen}
                    result={dialogState.result}
                    error={dialogState.error}
                    mode={dialogState.mode}
                    status={dialogState.status}
                    title={dialogState.title}
                />
            )}
        </>
    )
}

// ============================================
// BATCH ACTION HOOK
// ============================================

export type BatchActionButtonProps = {
    icon: LucideIcon
    label: string
    mode: ActionMode
    oltName: string
    interface: string
    onuSn?: string
}

export function useBatchAction() {
    const { addToQueue, actionQueue, clearQueue } = useActionStore()
    const { executeQueue } = useActionExecutor()

    const addAction = (props: Omit<BatchActionButtonProps, 'icon' | 'label'>) => {
        addToQueue({
            mode: props.mode,
            oltName: props.oltName,
            interface: props.interface,
            onuSn: props.onuSn,
        })
    }

    const executeBatch = async () => {
        if (actionQueue.length === 0) {
            toast.warning('No actions in queue')
            return
        }

        toast.info(`Executing ${actionQueue.length} actions...`)
        await executeQueue(actionQueue)
        toast.success('Batch execution complete!')
    }

    return {
        addAction,
        executeBatch,
        queueCount: actionQueue.length,
        clearQueue,
        queue: actionQueue,
    }
}
