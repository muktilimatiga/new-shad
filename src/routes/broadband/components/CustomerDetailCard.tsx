import { toast } from 'sonner'
import { Badge } from '~/components/ui/badge'
import { Copy, Users, KeyRound, Router, Signal, Ticket } from 'lucide-react'
import type { CustomerView } from '~/features/customer/customer.types'

const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
}

// Customer Detail Card Component
export function CustomerDetailCard({ customer }: { customer: CustomerView }) {
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
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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
    )
}
