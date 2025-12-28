import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AutoTanStackTable } from '~/components/autoTable'
import { useCustomersView } from '~/features/customer/customer.hooks'
import type { CustomerView } from '~/features/customer/customer.types'
import { toast } from 'sonner'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { useDebouncedValue } from '~/hooks/useDebounce'
import { Copy, MapPin, KeyRound } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'



const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('Copied!')
}

export function BroadbandPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 500)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerView | null>(
    null,
  )

  const { data: customers = [], isLoading } =
    useCustomersView(debouncedSearch)
  const columnOverrides = useMemo(() => {
    const overrides: Partial<Record<keyof CustomerView | 'actions', ColumnDef<CustomerView>>> = {

      // 1. CUSTOM NAME COLUMN (Name + Alamat)
      name: {
        header: 'Name',
        // 'row.original' gives you access to HIDDEN fields like 'alamat'
        cell: ({ row }) => (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {row.original.name || 'No Name'}
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

      // 2. CUSTOM PPPOE COLUMN (User | Pass)
      user_pppoe: {
        header: 'PPPoE Credentials',
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            {/* Username */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => row.original.user_pppoe && copyText(row.original.user_pppoe)}
            >
              <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
                {row.original.user_pppoe || 'No Username'}
              </span>
              <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Password (Optional: only show if you really want it exposed on the table) */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-1">
              <KeyRound className="h-3 w-3 opacity-50" />
              <span className="font-mono">
                {row.original.pppoe_password || 'No Password'}
              </span>
            </div>
          </div>
        ),
      },
      actions: {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="default"
            size="sm"
            onClick={() => setSelectedCustomer(row.original)}
          >
            Tagihan
          </Button>
        ),
      },
    }
    return overrides
  }, [])

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading broadband customers...
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Broadband Customers
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

      <AutoTanStackTable<CustomerView>
        data={customers}
        columnOverrides={columnOverrides}
        pageSize={20}
        enableSearch={false}
        visibleColumns={['name', 'user_pppoe', 'snmp_status']}
      />

    </div>
  )
}

export const Route = createFileRoute('/broadband/')({
  component: BroadbandPage,
})