

import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import type { Customer } from '~/@types/types';
import { useTicketStore } from '~/store/ticketStore';
import { cn } from '~/lib/utils';

interface CustomerCardProps {
    user: Customer;
    onChangeUser?: () => void;
}

export const CustomerCard = ({ user, onChangeUser }: CustomerCardProps) => {

    const selectedUser = useTicketStore((state) => state.selectedUser);
    const isSelected = selectedUser?.user_pppoe === user.user_pppoe;

    const getStatusBadge = (status: string | null | undefined) => {
        const statusLower = (status || '').toLowerCase();
        if (statusLower === 'online') {
            return (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    Online
                </Badge>
            );
        }
        if (statusLower === 'dyinggasp') {
            return (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    Dying Gasp
                </Badge>
            );
        }
        if (statusLower === 'offline') {
            return (
                <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                    Offline
                </Badge>
            );
        }
        if (statusLower === 'inactive') {
            return (
                <Badge className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20">
                    Inactive
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-muted-foreground">
                {status || 'Unknown'}
            </Badge>
        );
    };

    return (
        <div className={cn("group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-all hover:border-indigo-200 hover:shadow-sm dark:border-zinc-800 dark:bg-white/5 dark:hover:border-indigo-900/50", isSelected && "border-indigo-200")}>

            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 mt-1">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-none flex items-center gap-2">
                                {user.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {user.alamat}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px]">
                            {getStatusBadge(user.snmp_status)}
                            <span className="text-slate-300 dark:text-zinc-700">|</span>
                            <span className="font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                {user.user_pppoe}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {onChangeUser && (
                        <button
                            onClick={onChangeUser}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline decoration-indigo-300 underline-offset-2 transition-colors dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Change
                        </button>
                    )}
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-indigo-50/50 blur-2xl -z-10 dark:bg-indigo-500/5" />
        </div>
    );
};