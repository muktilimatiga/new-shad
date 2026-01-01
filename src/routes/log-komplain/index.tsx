import { useState, useMemo, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { AutoTanStackTable } from '~/components/autoTable'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { Ticket } from '~/@types/types'
import {
  RefreshCw,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  Forward,
  Plus,
  Filter,
  MoreHorizontal,
  SquareCheckBig,
  XSquare,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { ActionMenuItem } from '~/routes/broadband/components/ActionMenuItem'
import { TicketStatsCards } from './components/TicketStatsCards'
import { useTicketStore, type TicketMode } from '~/store/ticketStore'
import { useKomplainView } from '~/features/ticket/ticket.hooks'
import { ColumnFilter } from '~/components/columnFilter'
import { TicketModal } from '~/components/modal/ticketModal'

// --- Helper Components ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    open: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50',
    proses:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50',
    'done / fwd teknis':
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50',
    done: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50',
  }

  const style = styles[status] || styles['open']
  const label = status.replace(/_/g, ' ')

  return (
    <Badge
      variant="outline"
      className={`capitalize font-normal border ${style}`}
    >
      {label}
    </Badge>
  )
}

// --- Main Page Component ---

const LogTicketPage = () => {
  // 1. Data Fetching
  const { data: tickets = [], isFetching, refetch } = useKomplainView()

  // 2. Store Actions
  const initializeFromTicket = useTicketStore(
    (state) => state.initializeFromTicket,
  )
  const resetStore = useTicketStore((state) => state.reset)

  // 3. Local Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    mode: TicketMode
    ticketData?: Ticket
  }>({
    isOpen: false,
    mode: 'create',
    ticketData: undefined,
  })

  // 4. Modal Handlers
  const openModal = useCallback(
    (mode: TicketMode, ticket?: Ticket) => {
      // 1. Prepare Store Data
      if (ticket) {
        // Load existing ticket data into the generic store
        initializeFromTicket(ticket)
      } else {
        // Clear store for a new ticket
        resetStore()
      }

      // 2. Open Modal with the Data attached
      setModalConfig({
        isOpen: true,
        mode,
        ticketData: ticket,
      })
    },
    [initializeFromTicket, resetStore],
  )

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }))
  }

  // 5. Column Definitions
  const columnOverrides = useMemo<
    Partial<Record<keyof Ticket | 'actions', ColumnDef<Ticket>>>
  >(
    () => ({
      status: {
        accessorKey: 'status',
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: 'equalsString',
        meta: {
          filterType: 'select',
          filterOptions: ['open', 'proses', 'fwd teknis', 'done', 'done / fwd teknis'],
        },
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Status</span>
            <ColumnFilter column={column} />
          </div>
        ),
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      },

      assigneeId: {
        header: 'Assignee',
        accessorKey: 'assigneeId',
        cell: ({ row }: any) => {
          const val = row.getValue('assigneeId')
          return val ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <UserIcon className="h-3 w-3 text-muted-foreground" /> {val}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Unassigned</span>
          )
        },
      },

      // --- ACTIONS COLUMN ---
      actions: {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }: any) => {
          const t = row.original as Ticket

          return (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex justify-end h-8 w-8 p-0 rounded-lg data-[state=open]:bg-accent/50 transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4} className="w-40">
                {/* ACTION: PROCESS (Mode: open) */}
                {t.status === 'open' && (
                  <ActionMenuItem
                    icon={ArrowRight}
                    label="Process"
                    onClick={() => openModal('open', t)}
                  />
                )}

                {/* ACTION: FORWARD (Mode: forward) */}
                {t.status === 'proses' && (
                  <ActionMenuItem
                    icon={Forward}
                    label="Forward Ticket"
                    onClick={() => openModal('forward', t)}
                  />
                )}

                {/* ACTION: CLOSE (Mode: close) */}
                {t.status === 'proses' && (
                  <ActionMenuItem
                    icon={SquareCheckBig}
                    label="Close Ticket"
                    onClick={() => openModal('close', t)}
                  />
                )}

                {/* DONE STATE */}
                {(t.status === 'fwd teknis' ||
                  t.status === 'done' ||
                  t.status === 'closed') && (
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Done</span>
                    </div>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    }),
    [openModal],
  )

  // 6. Stats Calculation
  const stats = useMemo(() => {
    const isToday = (dateString: string | undefined) => {
      if (!dateString) return false
      const date = new Date(dateString)
      const today = new Date()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }

    const todayTickets = tickets.filter((t) => isToday(t.createdAt))

    const open = todayTickets.filter((t) => t.status === 'open').length
    const process = todayTickets.filter((t) => t.status === 'proses').length
    const done = todayTickets.filter((t) =>
      ['done', 'fwd teknis', 'closed'].includes(t.status || ''),
    ).length
    return { open, process, done, total: todayTickets.length }
  }, [tickets])

  return (
    <div className="animate-in fade-in duration-500 px-8 py-8 space-y-4">
      {/* --- THE UNIFIED MODAL --- */}
      <TicketModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        mode={modalConfig.mode}
        ticketData={modalConfig.ticketData}
      />

      {/* --- Header / Toolbar --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Log Komplain</h1>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-background"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {isFetching ? 'Loading...' : 'Refresh'}
          </Button>

          <Button variant="outline" className="bg-background">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>

          {/* CREATE NEW TICKET */}
          <Button onClick={() => openModal('create')} className="ml-2">
            <Plus className="mr-2 h-4 w-4" /> Open Ticket
          </Button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <TicketStatsCards stats={stats} />

      <AutoTanStackTable<Ticket>
        data={tickets}
        columnOverrides={columnOverrides}
        pageSize={15}
        visibleColumns={['ticketId', 'nama', 'kendala', 'status', 'waktu', 'tanggal']}
        mobileColumns={['ticketId', 'nama', 'status', 'actions']}
      />
    </div>
  )
}

export const Route = createFileRoute('/log-komplain/')({
  component: LogTicketPage,
})
