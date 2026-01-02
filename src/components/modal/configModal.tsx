import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'

import { toast } from 'sonner'
import { X, RefreshCw, Trash2, Layers, Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

// Hooks
import { useDebouncedValue } from '~/hooks/useDebounce'
import { useConfigStore } from '~/store/configStore'
import { useAppForm, FormProvider } from '~/components/form/hooks'
import { usePsbData, useScanOnts } from '~/services/useApi'
import { useConfigMutation } from '~/services/configMutation'


import { useCustomersView } from '~/features/customer/customer.hooks'
import { useLogActivity } from '~/features/activity-log/activity.hooks'

interface ConfigModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'manual' | 'auto' | 'batch' | 'bridge'
}

const EffectSync = ({
  value,
  onChange,
}: {
  value: any
  onChange: (val: any) => void
}) => {
  useEffect(() => {
    if (typeof value !== 'undefined') onChange(value)
  }, [value, onChange])
  return null
}

export const ConfigModal = ({ isOpen, onClose, type }: ConfigModalProps) => {
  // 1. Store State
  const {
    mode,
    setMode,
    selectedOlt,
    setSelectedOlt,
    batchQueue,
    addToBatch,
    removeFromBatch,
    detectedOnts,
    setDetectedOnts,
    reset,
  } = useConfigStore()

  // 2. Local Search State (Replaces useFiberStore)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500)

  // This handles loading, error, and caching automatically using React Query
  const {
    data: searchResults = [],
    isFetching: isSearchingCustomers,
    refetch: refetchCustomers,
  } = useCustomersView(debouncedSearchTerm) //

  // 4. Other APIs
  const {
    data: psbList,
    refetch: refetchPsb,
    isRefetching: isRefetchingPsb,
  } = usePsbData()

  const { mutateAsync: scanOnts, isPending: isScanning } = useScanOnts()

  // Activity logging
  const { mutate: logActivity } = useLogActivity()

  const currentType =
    type === 'batch' ? 'batch' : type === 'bridge' ? 'bridge' : mode
  const { FormFields, schema, execute, submitLabel } = useConfigMutation(
    currentType,
    selectedOlt,
  )

  const handleClose = () => {
    onClose()
    setTimeout(() => reset(), 200)
  }

  // 5. Form Engine
  const form = useAppForm({
    defaultValues: {
      olt_name: '',
      modem_type: '',
      onu_sn: '',
      package: '',
      name: '',
      address: '',
      user_pppoe: '',
      pass_pppoe: '',
      eth_locks: true,
      vlan_id: '',
      data_psb: '',
      fiber_source_id: '',
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      if (!value.olt_name) return toast.error('Please select an OLT')

      // Log config start
      logActivity({
        action: 'CONFIG_STARTED',
        target: value.olt_name,
        status: 'SUCCESS',
        details: JSON.stringify({
          mode: currentType,
          customer: value.name,
          sn: value.onu_sn,
        }),
      })

      try {
        if (currentType === 'batch') {
          // @ts-ignore
          await execute(value, batchQueue)
        } else {
          await execute(value)
        }

        // Log config success
        logActivity({
          action: 'CONFIG_SUCCESS',
          target: value.olt_name,
          status: 'SUCCESS',
          details: JSON.stringify({
            mode: currentType,
            customer: value.name,
            sn: value.onu_sn,
            pppoe: value.user_pppoe,
          }),
        })

        toast.success('Configuration started')
        handleClose()
      } catch (error: any) {
        // Log config failure
        logActivity({
          action: 'CONFIG_FAILED',
          target: value.olt_name,
          status: 'ERROR',
          details: error.message || 'Unknown error',
        })

        toast.error(error.message || 'Failed')
      }
    },
  })

  // 6. Handler: Select User from Search Results
  const handleSelectUser = (data: any) => {
    let selected: any = null

    // Determine if 'data' is the full object or just the ID string
    if (typeof data === 'object' && data !== null) {
      selected = data
    } else {
      // Find in our new React Query results
      selected = searchResults?.find((p) => p.user_pppoe === data)
    }

    if (selected) {
      form.setFieldValue('name', selected.nama || '')
      form.setFieldValue('address', selected.alamat || '')
      form.setFieldValue('user_pppoe', selected.user_pppoe || '')
      form.setFieldValue(
        'pass_pppoe',
        selected.pppoe_password || selected.pass_pppoe || '',
      )

      // Optional: Reset search after selection
      setSearchTerm('')
    }
  }

  const handleSelectPsb = (value: string) => {
    const selected = psbList?.find(
      (p: any) => p.user_pppoe === value || p.id === value,
    )
    if (selected) {
      form.setFieldValue('name', selected.name || '')
      form.setFieldValue('address', selected.address || '')
      // @ts-ignore - package might not be in DataPSB type definition yet
      if (selected.paket || selected.package)
        form.setFieldValue('package', selected.paket || '')
    }
  }

  const handleScan = async () => {
    const oltName = form.getFieldValue('olt_name')
    if (!oltName) return toast.error('Please select OLT first')

    try {
      const onts = await scanOnts(oltName)
      setDetectedOnts(onts || [])

      if (onts && onts.length > 0) {
        toast.success(`Found ${onts.length} devices`)
        // Auto-select first device if strictly 1 found and not batch mode
        if (type !== 'batch' && onts.length === 1) {
          form.setFieldValue('onu_sn', onts[0].sn)
        }
      } else {
        toast.info('No devices found')
      }
    } catch (e) {
      toast.error('Scan failed')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg w-[60vw] max-h-[90vh] flex flex-col p-0 gap-0 ring-0 border-0 outline-none focus:outline-none overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex flex-row justify-between items-center space-y-0 bg-background">
          <DialogTitle className="text-lg font-bold">
            {mode === 'manual' ? 'Manual' : 'Auto (API)'}
          </DialogTitle>

          <div className="flex items-center gap-4">
            {type !== 'batch' && type !== 'bridge' && (
              <div className="flex items-center gap-2 bg-muted p-1 pr-3 rounded-full">
                <Switch
                  checked={mode === 'manual'}
                  onCheckedChange={(c) => setMode(c ? 'manual' : 'auto')}
                  className="scale-75"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {mode === 'manual' ? 'Manual' : 'Auto'}
                </span>
              </div>
            )}
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <FormProvider value={form}>
            {/* Sync OLT */}
            <form.Subscribe
              selector={(state) => state.values.olt_name}
              children={(olt) => (
                <EffectSync value={olt} onChange={setSelectedOlt} />
              )}
            />

            {/* Sync PSB Selection */}
            <form.Subscribe
              selector={(state) => state.values.data_psb}
              children={(selectedId) => {
                useEffect(() => {
                  if (selectedId && psbList) handleSelectPsb(selectedId)
                }, [selectedId, psbList])
                return null
              }}
            />

            <FormFields
              mode={currentType}
              detectedOnts={detectedOnts}
              onScan={handleScan}
              isScanning={isScanning}
              // Auto Mode Props
              psbList={psbList}
              fetchPsbData={refetchPsb}
              isFetchingPSB={isRefetchingPsb}
              selectPSBList={handleSelectPsb}
              // Manual Mode Props
              selectUser={handleSelectUser}
              customerList={searchResults}
              customerSearchTerm={searchTerm}
              setCustomerSearchTerm={setSearchTerm}
              isSearchingCustomer={isSearchingCustomers}
              onCustomerSearch={() => refetchCustomers()}
            />
          </FormProvider>

          {/* Batch Queue UI */}
          {type === 'batch' && (
            <div className="mt-6 space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between items-end">
                <h3 className="text-xs font-bold uppercase text-muted-foreground">
                  Queue ({batchQueue.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="h-8 text-xs"
                >
                  <RefreshCw
                    className={cn('h-3 w-3 mr-2', isScanning && 'animate-spin')}
                  />
                  Scan
                </Button>
              </div>

              {/* Add to Queue */}
              {detectedOnts.length > 0 && (
                <div className="p-2 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg animate-in fade-in">
                  <select
                    className="w-full text-xs bg-transparent border-none outline-none text-blue-700 dark:text-blue-400 font-medium cursor-pointer"
                    onChange={(e) => {
                      const sn = e.target.value
                      if (!sn) return
                      const ont = detectedOnts.find((o) => o.sn === sn)
                      if (ont) addToBatch(ont)
                      e.target.value = ''
                    }}
                  >
                    <option value="">+ Add Detected Device to Queue...</option>
                    {detectedOnts.map((ont) => (
                      <option
                        key={ont.sn}
                        value={ont.sn}
                        disabled={!!batchQueue.find((b) => b.sn === ont.sn)}
                      >
                        {ont.sn} (Port {ont.pon_port || '?'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Queue List */}
              <div className="border rounded-lg overflow-hidden bg-muted/40 min-h-[150px]">
                {batchQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                    <Layers className="h-8 w-8 opacity-20" />
                    <p className="text-xs">Queue is empty</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {batchQueue.map((item, idx) => (
                      <div
                        key={item.sn}
                        className="flex items-center justify-between p-2.5 bg-background text-xs hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px]">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-mono font-bold text-foreground">
                              {item.sn}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              Port {item.port}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromBatch(item.sn)}
                          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-6 border-t flex-shrink-0 bg-muted/40">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="h-11 px-8 font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            disabled={form.state.isSubmitting}
            className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-semibold"
          >
            {form.state.isSubmitting && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {form.state.isSubmitting ? 'Processing...' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
