import { createFileRoute } from '@tanstack/react-router'
import { AutoTanStackTable } from '~/components/autoTable'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { LogActivity } from '~/features/activity-log/activity.types'
import { useActivityLogger } from '~/features/activity-log/activity.hooks'
import { Input } from '~/components/ui/input'
import { useDebouncedValue } from '~/hooks/useDebounce'
import type { ColumnDef } from '@tanstack/react-table'


export function LogsPage() {
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(search, 500)

    const { data: logs = [], isLoading } =
        useActivityLogger(debouncedSearch)
    const columnOverrides = useMemo(() => {
        const overrides: Partial<Record<keyof LogActivity | 'actions', ColumnDef<LogActivity>>> = {

            // 1. CUSTOM NAME COLUMN (Name + Alamat)
            target: {
                header: 'Name',
                // 'row.original' gives you access to HIDDEN fields like 'alamat'
                cell: ({ row }) => (
                    <div className="flex flex-col max-w-[200px]">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {row.original.target || 'No Name'}
                        </span>
                    </div>
                ),
            },

            // 2. CUSTOM PPPOE COLUMN (User | Pass)
            status: {
                header: 'Status',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {row.original.status || 'No Status'}
                        </span>
                    </div>
                ),
            },
        }
        return overrides
    }, [])

    if (isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Loading logs...
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4 mt-2">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Logs
                </h1>
                {/* 4. Add a Search Input */}
                <div className="w-64">
                    <Input
                        placeholder="Search database..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-10">
                <AutoTanStackTable<LogActivity>
                    data={logs}
                    columnOverrides={columnOverrides}
                    pageSize={20}
                    enableSearch={false}
                    visibleColumns={['target', 'status', 'action', 'createdAt']}
                />
            </div>
        </div>
    )
}


export const Route = createFileRoute('/logs/')({
    component: LogsPage,
})
