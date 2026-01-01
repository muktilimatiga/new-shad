import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { type LucideIcon } from 'lucide-react'

// Reusable Action Menu Item Component
export type ActionMenuItemProps = {
    icon: LucideIcon
    label: string
    onClick: () => void
    destructive?: boolean
}

export function ActionMenuItem({ icon: Icon, label, onClick, destructive }: ActionMenuItemProps) {
    return (
        <DropdownMenuItem
            onClick={onClick}
            variant={destructive ? 'destructive' : 'default'}
            className="gap-2 py-1.5 text-sm"
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </DropdownMenuItem>
    )
}
