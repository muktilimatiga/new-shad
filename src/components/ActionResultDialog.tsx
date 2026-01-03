import { useState, useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogMedia,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { useActionStore, type ActionItem, type ActionMode } from '~/store/actionStore'
import {
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    Search,
    Wifi,
    WifiOff,
    Copy,
    Terminal,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

// ============================================
// TYPES
// ============================================

interface ActionResultDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    result?: any
    error?: string
    mode?: ActionMode
    status?: 'pending' | 'running' | 'success' | 'error'
    title?: string
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StatusIcon({ status }: { status: ActionItem['status'] }) {
    switch (status) {
        case 'pending':
            return <Loader2 className="h-6 w-6 text-muted-foreground" />
        case 'running':
            return <Loader2 className="h-6 w-6 text-primary animate-spin" />
        case 'success':
            return <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        case 'error':
            return <XCircle className="h-6 w-6 text-destructive" />
        default:
            return <Terminal className="h-6 w-6 text-muted-foreground" />
    }
}

function ModeIcon({ mode }: { mode?: ActionMode }) {
    switch (mode) {
        case 'cek':
        case 'cek-redaman':
        case 'cek-detail-port':
        case 'cek-redaman-1-port':
            return <Search className="h-6 w-6" />
        case 'reboot':
            return <RefreshCw className="h-6 w-6" />
        case 'no-onu':
            return <WifiOff className="h-6 w-6" />
        default:
            return <Wifi className="h-6 w-6" />
    }
}

function getStatusColor(status?: ActionItem['status']) {
    switch (status) {
        case 'success':
            return 'bg-emerald-500/10 text-emerald-600'
        case 'error':
            return 'bg-destructive/10 text-destructive'
        case 'running':
            return 'bg-primary/10 text-primary'
        default:
            return 'bg-muted text-muted-foreground'
    }
}

function getModeLabel(mode?: ActionMode) {
    switch (mode) {
        case 'cek':
            return 'Cek ONU'
        case 'cek-redaman':
            return 'Cek Redaman'
        case 'cek-detail-port':
            return 'Cek Detail Port'
        case 'cek-redaman-1-port':
            return 'Cek Redaman 1 Port'
        case 'reboot':
            return 'Reboot ONU'
        case 'no-onu':
            return 'No ONU'
        default:
            return 'Action Result'
    }
}

// ============================================
// RESULT DISPLAY COMPONENT
// ============================================

function ResultContent({ result, error }: { result?: any; error?: string }) {
    const copyResult = () => {
        const text = error || (typeof result === 'string' ? result : JSON.stringify(result, null, 2))
        navigator.clipboard.writeText(text)
        toast.success('Result copied to clipboard!')
    }

    if (error) {
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-destructive">Error</span>
                    <Button variant="ghost" size="sm" onClick={copyResult} className="h-6 px-2">
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive font-mono break-all">{error}</p>
                </div>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No result data available</p>
            </div>
        )
    }

    // Handle string result (most common from API)
    if (typeof result === 'string') {
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Result</span>
                    <Button variant="ghost" size="sm" onClick={copyResult} className="h-6 px-2">
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 max-h-[300px] overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-all">{result}</pre>
                </div>
            </div>
        )
    }

    // Handle OnuDetailResponse or object result
    if (typeof result === 'object') {
        const displayResult = result.result || result

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Result</span>
                    <Button variant="ghost" size="sm" onClick={copyResult} className="h-6 px-2">
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 max-h-[300px] overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                        {typeof displayResult === 'string'
                            ? displayResult
                            : JSON.stringify(displayResult, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

    return null
}

// ============================================
// MAIN DIALOG COMPONENT
// ============================================

export function ActionResultDialog({
    open,
    onOpenChange,
    result,
    error,
    mode,
    status = 'success',
    title,
}: ActionResultDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogMedia className={cn(getStatusColor(status))}>
                        {status === 'running' || status === 'pending' ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : status === 'error' ? (
                            <XCircle className="h-5 w-5" />
                        ) : (
                            <ModeIcon mode={mode} />
                        )}
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title || getModeLabel(mode)}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {status === 'running'
                            ? 'Processing your request...'
                            : status === 'error'
                                ? 'An error occurred while executing the action.'
                                : 'Action completed successfully.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <ResultContent result={result} error={error} />

                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// ============================================
// HOOK FOR MANAGING DIALOG STATE
// ============================================

export function useActionResultDialog() {
    const [dialogState, setDialogState] = useState<{
        open: boolean
        result?: any
        error?: string
        mode?: ActionMode
        status: ActionItem['status']
        title?: string
    }>({
        open: false,
        status: 'pending',
    })

    const showResult = (params: {
        result?: any
        error?: string
        mode?: ActionMode
        title?: string
    }) => {
        setDialogState({
            open: true,
            result: params.result,
            error: params.error,
            mode: params.mode,
            status: params.error ? 'error' : 'success',
            title: params.title,
        })
    }

    const showLoading = (mode?: ActionMode, title?: string) => {
        setDialogState({
            open: true,
            mode,
            status: 'running',
            title,
        })
    }

    const closeDialog = () => {
        setDialogState((prev) => ({ ...prev, open: false }))
    }

    return {
        dialogState,
        showResult,
        showLoading,
        closeDialog,
        setOpen: (open: boolean) => setDialogState((prev) => ({ ...prev, open })),
    }
}

// ============================================
// QUEUE RESULTS DIALOG (Shows all queue results)
// ============================================

export function ActionQueueResultDialog() {
    const { actionQueue, clearQueue } = useActionStore()
    const [open, setOpen] = useState(false)

    // Auto-open when there are completed items
    useEffect(() => {
        const hasCompleted = actionQueue.some((item) => item.status === 'success' || item.status === 'error')
        if (hasCompleted && actionQueue.length > 0) {
            setOpen(true)
        }
    }, [actionQueue])

    const successCount = actionQueue.filter((item) => item.status === 'success').length
    const errorCount = actionQueue.filter((item) => item.status === 'error').length
    const runningCount = actionQueue.filter((item) => item.status === 'running').length

    if (actionQueue.length === 0) return null

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="sm:max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-primary/10 text-primary">
                        <Terminal className="h-5 w-5" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Action Queue Results</AlertDialogTitle>
                    <AlertDialogDescription>
                        {runningCount > 0
                            ? `Processing ${runningCount} action(s)...`
                            : `Completed: ${successCount} success, ${errorCount} failed`}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="max-h-[400px] overflow-auto space-y-2">
                    {actionQueue.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'rounded-lg border p-3 space-y-2',
                                item.status === 'success' && 'border-emerald-500/30 bg-emerald-500/5',
                                item.status === 'error' && 'border-destructive/30 bg-destructive/5',
                                item.status === 'running' && 'border-primary/30 bg-primary/5'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <StatusIcon status={item.status} />
                                    <span className="text-sm font-medium">{getModeLabel(item.mode)}</span>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {item.interface}
                                </span>
                            </div>

                            {(item.result || item.error) && (
                                <div className="bg-background/50 rounded p-2 max-h-[100px] overflow-auto">
                                    <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                        {item.error ||
                                            (typeof item.result === 'string'
                                                ? item.result
                                                : JSON.stringify(item.result?.result || item.result, null, 2))}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            clearQueue()
                            setOpen(false)
                        }}
                    >
                        Clear & Close
                    </Button>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
