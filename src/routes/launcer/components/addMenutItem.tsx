import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import { Plus, X, Settings, Layers, Ticket, Network } from "lucide-react"

// Define what the parent needs to pass down
interface AddItemMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (modalName: string) => void
}

export function AddItemMenu({ isOpen, onOpenChange, onSelect }: AddItemMenuProps) {

  // Helper to close this menu and open the next modal in one go
  const handleSelect = (modalName: string) => {
    onOpenChange(false) // Close this menu
    setTimeout(() => onSelect(modalName), 150) // Small delay for smooth transition (optional)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:!max-w-2xl p-0 overflow-hidden gap-0 rounded-2xl border border-border shadow-2xl [&>button]:hidden bg-background">

        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                  Add New Item
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-tight">
                  Select an action to proceed
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Grid Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30">

          <MenuButton
            icon={<Settings className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />}
            title="New Config"
            desc="Configure OLT/ONU"
            colorClass="indigo"
            onClick={() => handleSelect('config')}
          />

          <MenuButton
            icon={<Layers className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
            title="New Batch"
            desc="Bulk provisioning"
            colorClass="blue"
            onClick={() => handleSelect('config_batch')}
          />

          <MenuButton
            icon={<Ticket className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />}
            title="New Ticket"
            desc="Support ticket"
            colorClass="emerald"
            onClick={() => handleSelect('create_ticket')}
          />

          <MenuButton
            icon={<Network className="h-8 w-8 text-amber-600 dark:text-amber-400" />}
            title="Config Bridge"
            desc="Bridge mode"
            colorClass="amber"
            onClick={() => handleSelect('config_bridge')}
          />

        </div>
      </DialogContent>
    </Dialog>
  )
}

// Small sub-component to keep the main code clean
function MenuButton({ icon, title, desc, onClick, colorClass }: any) {
  // Map color names to actual Tailwind classes dynamically or explicitly
  const colorMap: Record<string, string> = {
    indigo: "hover:border-indigo-500 dark:hover:border-indigo-500 from-indigo-50/50 dark:from-indigo-900/10 bg-indigo-50/50 dark:bg-indigo-900/10",
    blue: "hover:border-blue-500 dark:hover:border-blue-500 from-blue-50/50 dark:from-blue-900/10 bg-blue-50/50 dark:bg-blue-900/10",
    emerald: "hover:border-emerald-500 dark:hover:border-emerald-500 from-emerald-50/50 dark:from-emerald-900/10 bg-emerald-50/50 dark:bg-emerald-900/10",
    amber: "hover:border-amber-500 dark:hover:border-amber-500 from-amber-50/50 dark:from-amber-900/10 bg-amber-50/50 dark:bg-amber-900/10",
  }
  const colors = colorMap[colorClass]

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-8 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all group overflow-hidden ${colors.split(' ')[0]}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${colors.split(' ')[1]}`} />
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${colors.split(' ')[2]}`}>
        {icon}
      </div>
      <span className="font-bold text-lg text-foreground">{title}</span>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </button>
  )
}