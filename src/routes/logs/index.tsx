import { createFileRoute } from '@tanstack/react-router'
import { AutoTanStackTable } from '~/components/autoTable'
import { useMemo, useState } from 'react'
import { LogActivity } from '~/features/activity-log/activity.types'
import { useActivityLogger } from '~/features/activity-log/activity.hooks'
import { Input } from '~/components/ui/input'
import { useDebouncedValue } from '~/hooks/useDebounce'
import type { ColumnDef } from '@tanstack/react-table'
import { CheckCircle, XCircle, Settings, Ticket, Activity } from 'lucide-react'
import { cn } from '~/lib/utils'

// Helper to format action names nicely
const formatAction = (action: string) => {
  const actionMap: Record<
    string,
    { label: string; icon: typeof Settings; color: string }
  > = {
    CONFIG_STARTED: {
      label: 'Config Started',
      icon: Settings,
      color: 'text-blue-500 bg-blue-500/10',
    },
    CONFIG_SUCCESS: {
      label: 'Config Success',
      icon: Settings,
      color: 'text-green-500 bg-green-500/10',
    },
    CONFIG_FAILED: {
      label: 'Config Failed',
      icon: Settings,
      color: 'text-red-500 bg-red-500/10',
    },
    TICKET_CREATED: {
      label: 'Ticket Created',
      icon: Ticket,
      color: 'text-purple-500 bg-purple-500/10',
    },
    TICKET_OPENED: {
      label: 'Ticket Opened',
      icon: Ticket,
      color: 'text-blue-500 bg-blue-500/10',
    },
    TICKET_FORWARDED: {
      label: 'Ticket Forwarded',
      icon: Ticket,
      color: 'text-orange-500 bg-orange-500/10',
    },
    TICKET_CLOSED: {
      label: 'Ticket Closed',
      icon: Ticket,
      color: 'text-gray-500 bg-gray-500/10',
    },
  }
  return (
    actionMap[action] || {
      label: action,
      icon: Activity,
      color: 'text-muted-foreground bg-muted',
    }
  )
}

export function LogsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 500)

  const { data: logs = [], isLoading } = useActivityLogger(debouncedSearch)

  const columnOverrides = useMemo(() => {
    const overrides: Partial<
      Record<keyof LogActivity | 'actions', ColumnDef<LogActivity>>
    > = {
      // Target column (customer name or OLT)
      target: {
        header: 'Target',
        cell: ({ row }) => (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-semibold text-sm">
              {row.original.target || 'Unknown'}
            </span>
          </div>
        ),
      },

      // Action column with icon and badge
      action: {
        header: 'Action',
        cell: ({ row }) => {
          const actionInfo = formatAction(row.original.action || '')
          const Icon = actionInfo.icon
          return (
            <div
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                actionInfo.color,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {actionInfo.label}
            </div>
          )
        },
      },

      // Status column with colored badge
      status: {
        header: 'Status',
        cell: ({ row }) => {
          const isSuccess =
            row.original.status === true || row.original.status === 'SUCCESS'
          return (
            <div
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium',
                isSuccess
                  ? 'text-green-600 bg-green-500/10 dark:text-green-400'
                  : 'text-red-600 bg-red-500/10 dark:text-red-400',
              )}
            >
              {isSuccess ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {isSuccess ? 'Success' : 'Error'}
            </div>
          )
        },
      },

      // Timestamp column
      createdAt: {
        header: 'Time',
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt)
          return (
            <span className="text-xs text-muted-foreground">
              {date.toLocaleDateString()}{' '}
              {date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )
        },
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track configuration and ticket operations
          </p>
        </div>
        <div className="w-64">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6">
        <AutoTanStackTable<LogActivity>
          data={logs}
          columnOverrides={columnOverrides}
          pageSize={20}
          enableSearch={false}
          visibleColumns={['action', 'target', 'status', 'createdAt']}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/logs/')({
  component: LogsPage,
})
