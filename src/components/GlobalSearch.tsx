import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { useDebouncedValue } from '~/hooks/useDebounce'
import { useCustomersView } from '~/features/customer/customer.hooks'
import { CustomerDetailCard } from '~/routes/broadband/components/CustomerDetailCard'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { CustomerView } from '~/features/customer/customer.types'

export const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerView | null>(null)

    // 500ms debounce
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 500)

    // Fetch data
    const { data: searchResults = [], isLoading } = useCustomersView(debouncedSearchTerm)

    // Handle selection
    const handleSelect = (customer: CustomerView) => {
        setSelectedCustomer(customer)
        setSearchTerm("") // Clear search
        setIsOpen(false) // Close dropdown
    }

    return (
        <>
            <div className="relative hidden lg:flex items-center mr-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        className="h-9 w-56 rounded-full bg-slate-100 dark:bg-slate-900/50 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 text-slate-900 dark:text-white transition-all duration-200 focus:w-72 focus:ring-2 focus:ring-indigo-500/30 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-black"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            if (e.target.value) setIsOpen(true)
                        }}
                        onFocus={() => {
                            if (searchTerm) setIsOpen(true)
                        }}
                        onBlur={() => {
                            // Delay closing to allow clicks
                            setTimeout(() => setIsOpen(false), 200)
                        }}
                    />

                    {/* Dropdown Results */}
                    {isOpen && searchTerm && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 max-h-[400px] overflow-y-auto space-y-1">
                                {isLoading ? (
                                    <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                                        <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((c) => (
                                        <div
                                            key={c.id}
                                            onClick={() => handleSelect(c)}
                                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                        >
                                            <Avatar className="h-9 w-9 text-xs border border-slate-200 dark:border-slate-700">
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium">
                                                    {(c.nama || c.user_pppoe)?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate text-foreground">{c.nama || c.user_pppoe}</p>
                                                <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                                                    <span className="font-mono text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">{c.user_pppoe}</span>
                                                    <span className="truncate max-w-[140px]">{c.alamat}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        No results found for "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>Customer Details</DialogTitle>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                        {selectedCustomer && <CustomerDetailCard customer={selectedCustomer} />}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
