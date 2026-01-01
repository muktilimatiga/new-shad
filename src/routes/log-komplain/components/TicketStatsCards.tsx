import { FileText, AlertCircle, PlayCircle, CheckCircle2 } from 'lucide-react'

interface TicketStats {
    total: number
    open: number
    process: number
    done: number
}

interface TicketStatsCardsProps {
    stats: TicketStats
}

export function TicketStatsCards({ stats }: TicketStatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* TOTAL */}
            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total Tickets</p>
                    </div>
                </div>
            </div>

            {/* OPEN (Red) */}
            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                        <p className="text-xs text-muted-foreground">Open</p>
                    </div>
                </div>
            </div>

            {/* PROCESS (Blue) */}
            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-500/10">
                        <PlayCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{stats.process}</p>
                        <p className="text-xs text-muted-foreground">On Process</p>
                    </div>
                </div>
            </div>

            {/* DONE (Green) */}
            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.done}</p>
                        <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
