import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AutoTanStackTable } from '~/components/autoTable'
import { useCustomersView } from '~/features/customer/customer.hooks'
import type { CustomerView } from '~/features/customer/customer.types'
import { toast } from 'sonner'

import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useDebouncedValue } from '~/hooks/useDebounce'
import { MoreHorizontal, FileText, RefreshCw, Trash2, Search, Eye, Copy, MapPin, KeyRound } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { ActionMenuItem } from './components/ActionMenuItem'
import { CustomerDetailCard } from './components/CustomerDetailCard'
import { StatsCards } from './components/StatsCards'

const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('Copied!')
}

// Main Component
export function BroadbandPage() {
  const [search, setSearch] = useState('')
  // Fixed: useDebouncedValue returns a value, not an array
  const debouncedSearch = useDebouncedValue(search, 500)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerView | null>(null)

  const { data: customers = [], isLoading, isFetching } = useCustomersView(debouncedSearch)

  // Only show full page skeleton on initial load (no data yet)
  const showFullSkeleton = isLoading && customers.length === 0
  // Show table loading overlay when fetching (refetching on search)
  const showTableLoading = isFetching && !showFullSkeleton

  // Helper function to get status badge styling
  const getStatusBadge = (status: string | null | undefined) => {
    const statusLower = (status || '').toLowerCase()

    if (statusLower === 'online') {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          Online
        </Badge>
      )
    }
    if (statusLower === 'dyinggasp') {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
          Dying Gasp
        </Badge>
      )
    }
    if (statusLower === 'offline') {
      return (
        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
          Offline
        </Badge>
      )
    }
    if (statusLower === 'inactive') {
      return (
        <Badge className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20">
          Inactive
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        {status || 'Unknown'}
      </Badge>
    )
  }

  const columnOverrides = useMemo(() => {
    const overrides: Partial<Record<keyof CustomerView | 'actions', ColumnDef<CustomerView>>> = {
      nama: {
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex flex-col max-w-[250px]">
            <span className="font-semibold text-sm">
              {row.original.nama || 'No Name'}
            </span>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground truncate">
              <MapPin className="h-3 w-3 shrink-0 opacity-50" />
              <span className="truncate" title={row.original.alamat || undefined}>
                {row.original.alamat || 'No Address'}
              </span>
            </div>
          </div>
        ),
      },
      user_pppoe: {
        header: 'PPPoE Credentials',
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => row.original.user_pppoe && copyText(row.original.user_pppoe)}
            >
              <span className="font-mono text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                {row.original.user_pppoe || 'No Username'}
              </span>
              <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-1">
              <KeyRound className="h-3 w-3 opacity-50" />
              <span className="font-mono">
                {row.original.pppoe_password || 'No Password'}
              </span>
            </div>
          </div>
        ),
      },
      snmp_status: {
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original.snmp_status),
      },
      actions: {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex justify-end h-8 w-8 p-0 rounded-lg data-[state=open]:bg-accent/50 transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-40">
              <ActionMenuItem
                icon={Eye}
                label="View Details"
                onClick={() => setSelectedCustomer(row.original)}
              />
              <ActionMenuItem
                icon={FileText}
                label="Tagihan"
                onClick={() => toast.info(`Opening Tagihan for ${row.original.nama}...`)}
              />
              <ActionMenuItem
                icon={RefreshCw}
                label="Reboot"
                onClick={() => toast.info(`Rebooting ${row.original.nama}...`)}
              />
              <DropdownMenuSeparator />
              <ActionMenuItem
                icon={Trash2}
                label="Delete"
                destructive
                onClick={() => toast.error(`Delete action for ${row.original.nama}`)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    }
    return overrides
  }, [])

  // Stats calculation
  const stats = useMemo(() => {
    const online = customers.filter(c => c.snmp_status?.toLowerCase() === 'online').length
    const offline = customers.filter(c => c.snmp_status?.toLowerCase() === 'offline').length
    const dyingGasp = customers.filter(c => c.snmp_status?.toLowerCase() === 'dyinggasp').length
    return { online, offline, dyingGasp, total: customers.length }
  }, [customers])

  if (showFullSkeleton) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-14 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Broadband Customers</h1>
            <p className="text-sm text-muted-foreground">Manage and monitor customer connections</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats Cards - Simple shadcn style */}
      <StatsCards stats={stats} />

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden relative">
        {showTableLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
        <AutoTanStackTable<CustomerView>
          data={customers}
          columnOverrides={columnOverrides}
          pageSize={20}
          enableSearch={false}
          visibleColumns={['nama', 'user_pppoe', 'snmp_status']}
        />
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.nama || 'Customer information'}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && <CustomerDetailCard customer={selectedCustomer} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Route = createFileRoute('/broadband/')({
  component: BroadbandPage,
})