import { useState, useEffect, useMemo } from 'react'
import { Copy, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import type { CustomerView } from '~/features/customer/customer.types'
import { useCustomerInvoices } from '~/services/useApi'

interface InvoicePaymentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer: CustomerView | null
}

export function InvoicePaymentModal({
    open,
    onOpenChange,
    customer,
}: InvoicePaymentModalProps) {
    const [message, setMessage] = useState('')

    // Fetch invoice data when modal opens
    const query = open && customer?.user_pppoe ? customer.user_pppoe : ''
    const { data: customersWithInvoices, isLoading } = useCustomerInvoices(query)

    // Extract invoice data from API response
    const invoiceData = useMemo(() => {
        if (!customersWithInvoices || customersWithInvoices.length === 0) return null
        const customerData = customersWithInvoices[0]
        const billing = customerData.invoices?.[0]
        return {
            name: customerData.name,
            user_pppoe: customerData.user_pppoe,
            this_month: billing?.this_month || null,
            arrears_count: billing?.arrears_count ?? 0,
            last_paid_month: billing?.last_paid_month || null,
        }
    }, [customersWithInvoices])

    const isPaid = invoiceData?.this_month?.toLowerCase().includes('lunas') ?? false
    const hasArrears = (invoiceData?.arrears_count ?? 0) > 0

    // Build default message when data loads
    useEffect(() => {
        if (invoiceData && customer) {
            const lines = [
                `Yth. Pelanggan ${customer.nama || invoiceData.name}`,
                ``,
                `ID: ${customer.user_pppoe}`,
                `Status Bulan Ini: ${invoiceData.this_month || '-'}`,
                `Tunggakan: ${invoiceData.arrears_count} bulan`,
                `Terakhir Bayar: ${invoiceData.last_paid_month || '-'}`,
                ``,
                isPaid ? 'Terima kasih atas pembayarannya.' : 'Mohon segera lakukan pembayaran.',
            ]
            setMessage(lines.join('\n'))
        }
    }, [invoiceData, customer, isPaid])

    const handleCopy = () => {
        navigator.clipboard.writeText(message)
        toast.success('Message copied!')
    }

    if (!customer) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b flex-row items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${isPaid
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                        {isPaid ? <CheckCircle className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                        <DialogTitle className="text-base">{isPaid ? 'Status: Lunas' : 'Tagihan Pelanggan'}</DialogTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{customer.nama}</p>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading invoice data...
                        </div>
                    ) : (
                        <>
                            {/* Info Summary */}
                            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Customer</span>
                                    <span className="text-sm font-medium">{customer.nama}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">ID PPPoE</span>
                                    <span className="text-sm font-mono">{customer.user_pppoe}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Status Bulan Ini</span>
                                    <Badge variant={isPaid ? 'default' : 'secondary'} className={
                                        isPaid
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                    }>
                                        {invoiceData?.this_month || '-'}
                                    </Badge>
                                </div>
                                {hasArrears && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">Tunggakan</span>
                                        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                                            {invoiceData?.arrears_count} bulan
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Terakhir Bayar</span>
                                    <span className="text-sm">{invoiceData?.last_paid_month || '-'}</span>
                                </div>
                            </div>

                            {/* Message Editor */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Pesan Tagihan</Label>
                                    {!invoiceData && !isLoading && (
                                        <span className="text-[10px] text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> No data from API
                                        </span>
                                    )}
                                </div>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[180px] font-mono text-xs leading-relaxed"
                                    placeholder={isLoading ? 'Loading...' : 'No data available'}
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t gap-2">
                    <Button variant="outline" onClick={handleCopy} disabled={!message || isLoading}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isPaid ? 'Tutup' : 'Kirim'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}