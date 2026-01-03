import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu'
import { Copy, Users, KeyRound, Router, Signal, Ticket, CreditCard, Search, ChevronDown, RefreshCw, Zap, Activity } from 'lucide-react'
import type { CustomerView } from '~/features/customer/customer.types'
import { InvoicePaymentModal } from '~/components/modal/invoiceModal'
import { ActionDropdownItem } from './ActionMenuItem'

const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
}

// Customer Detail Card Component
export function CustomerDetailCard({ customer }: { customer: CustomerView }) {
    const [invoiceOpen, setInvoiceOpen] = useState(false)

    const getStatusBadgeInline = (status: string | null | undefined) => {
        const s = (status || '').toLowerCase()
        if (s === 'online') return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Online</Badge>
        if (s === 'dyinggasp') return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Dying Gasp</Badge>
        if (s === 'offline') return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Offline</Badge>
        return <Badge variant="outline">{status || 'Unknown'}</Badge>
    }

    const DetailRow = ({ label, value, copyable = false }: { label: string; value: string | null | undefined; copyable?: boolean }) => (
        <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-right max-w-[200px] truncate" title={value || undefined}>
                    {value || '-'}
                </span>
                {copyable && value && (
                    <button onClick={() => copyText(value)} className="p-1 hover:bg-muted rounded">
                        <Copy className="h-3 w-3 text-muted-foreground" />
                    </button>
                )}
            </div>
        </div>
    )

    return (
        <>
            <div className="flex flex-col h-[calc(70vh-120px)] max-h-[500px]">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {/* Customer Info */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Users className="h-3 w-3" /> Customer Info
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                            <DetailRow label="Name" value={customer.nama} />
                            <DetailRow label="Address" value={customer.alamat} />
                            <DetailRow label="Package" value={customer.paket} />
                        </div>
                    </div>

                    {/* PPPoE Credentials */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <KeyRound className="h-3 w-3" /> PPPoE Credentials
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                            <DetailRow label="Username" value={customer.user_pppoe} copyable />
                            <DetailRow label="Password" value={customer.pppoe_password} copyable />
                        </div>
                    </div>

                    {/* OLT & Network */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Router className="h-3 w-3" /> OLT & Network
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                            <DetailRow label="OLT Name" value={customer.olt_name} />
                            <DetailRow label="OLT Port" value={customer.olt_port} />
                            <DetailRow label="Interface" value={customer.interface} />
                            <DetailRow label="ONU SN" value={customer.onu_sn} copyable />
                            <DetailRow label="Modem Type" value={customer.modem_type} />
                        </div>
                    </div>

                    {/* SNMP Status */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Signal className="h-3 w-3" /> SNMP Status
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadgeInline(customer.snmp_status)}
                            </div>
                            <DetailRow label="RX Power" value={customer.rx_power_str} />
                            <DetailRow label="Last Updated" value={customer.snmp_last_updated ? new Date(customer.snmp_last_updated).toLocaleString() : null} />
                        </div>
                    </div>

                    {/* Latest Ticket */}
                    {(customer.latest_tiket || customer.latest_kendala) && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <Ticket className="h-3 w-3" /> Latest Ticket
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <DetailRow label="Ticket" value={customer.latest_tiket} />
                                <DetailRow label="Issue" value={customer.latest_kendala} />
                                <DetailRow label="Action" value={customer.latest_action} />
                                <DetailRow label="Date" value={customer.latest_kendala_at ? new Date(customer.latest_kendala_at).toLocaleString() : null} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Action Buttons Footer */}
                <div className="flex gap-3 pt-4 mt-4 border-t border-border/50 bg-background sticky bottom-0">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 h-10 text-sm font-medium rounded-xl border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-all"
                        onClick={() => setInvoiceOpen(true)}
                    >
                        <CreditCard className="h-4 w-4" />
                        Payment
                    </Button>

                    {/* Cek Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="flex-1 gap-2 h-10 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 transition-all inline-flex items-center justify-center px-4 bg-background"
                        >
                            <Search className="h-4 w-4" />
                            Cek
                            <ChevronDown className="h-3 w-3 ml-auto opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <ActionDropdownItem
                                icon={Search}
                                label="Cek ONU"
                                mode="cek"
                                oltName={customer.olt_name || ''}
                                interface={customer.interface || ''}
                                onuSn={customer.onu_sn || undefined}
                            />
                            <ActionDropdownItem
                                icon={Zap}
                                label="Cek Redaman"
                                mode="cek-redaman"
                                oltName={customer.olt_name || ''}
                                interface={customer.interface || ''}
                            />
                            <ActionDropdownItem
                                icon={Activity}
                                label="Cek Detail Port"
                                mode="cek-detail-port"
                                oltName={customer.olt_name || ''}
                                interface={customer.interface || ''}
                            />
                            <DropdownMenuSeparator />
                            <ActionDropdownItem
                                icon={RefreshCw}
                                label="Reboot ONU"
                                mode="reboot"
                                oltName={customer.olt_name || ''}
                                interface={customer.interface || ''}
                                destructive
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Invoice Modal */}
            <InvoicePaymentModal
                open={invoiceOpen}
                onOpenChange={setInvoiceOpen}
                customer={customer}
            />
        </>
    )
}

