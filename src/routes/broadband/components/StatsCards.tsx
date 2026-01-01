import { Users, Zap, Wifi } from 'lucide-react'

interface Stats {
    total: number
    online: number
    offline: number
    dyingGasp: number
}

interface StatsCardsProps {
    stats: Stats
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-emerald-500/10">
                        <Zap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.online}</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-amber-500/10">
                        <Wifi className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-amber-600">{stats.dyingGasp}</p>
                        <p className="text-xs text-muted-foreground">Dying Gasp</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-red-500/10">
                        <Wifi className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
                        <p className="text-xs text-muted-foreground">Offline</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
