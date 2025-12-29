import { useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback} from '../ui/avatar'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "~/components/ui/dialog"; // CHANGED: Import Shadcn Dialog
import { useTicketStore } from '@/store/ticketStore';
import { useFiberStore } from '@/store/useFiberStore';
import { CustomerCard } from '../customerCard';
import { useAppForm, FormProvider } from '@/components/form/hooks';
import { useActionSuccess, useActionError } from '@/hooks/useActionLog';
import { toast } from 'sonner';

// Import the Strategy Hook
import { useTicketForm, type TicketMode } from '@/store/useTicketForm';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: TicketMode;
    ticketData?: any;
}

export const TicketModal = ({ isOpen, onClose, mode, ticketData }: TicketModalProps) => {

    // 1. Get Store Data
    const {
        step, setStep, selectUser, selectedUser,
        formData, initializeFromTicket, reset: resetStore
    } = useTicketStore();

    const {
        searchTerm, setSearchTerm, searchResults, isSearching, searchCustomers, resetSearch
    } = useFiberStore();

    // 2. PARSE STRATEGY
    const { title, FormFields, schema, mutation, submitLabel, variant, execute } = useTicketForm(mode);
    const onSuccessAction = useActionSuccess();
    const onErrorAction = useActionError();

    // 3. Setup Form Engine
    const form = useAppForm({
        defaultValues: {
            name: '',
            address: '',
            description: '',
            priority: 'Low',
            olt_name: '',
            user_pppoe: '',
            onu_sn: '',
            interface: '',
            ticketRef: '',
            type: 'FREE',
            action_ticket: '',
            action_close: '',
            last_action: '',
            service_impact: '',
            root_cause: '',
            network_impact: '',
            person_in_charge: '',
            recomended_action: '',
            PIC: ''
        },
        validators: { onChange: schema as any },
        onSubmit: async ({ value }) => {
            try {
                await execute(value);
                toast.success(submitLabel + " successful");
                onSuccessAction(value, {
                    title,
                    action: mode === 'create' ? "create" : "update",
                    target: "ticket",
                    onDone: handleClose,
                });
            } catch (error) {
                toast.error("An error occurred");
                console.error(error);
                onErrorAction(error as any, mode === 'create' ? "create" : "update", "ticket");
            }
        }
    });

    // 4. LIFECYCLE: DATA INITIALIZATION
    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                resetStore();
                resetSearch();
                form.reset();
                setStep(1);
            } else if (ticketData) {
                initializeFromTicket(ticketData);
                form.reset({
                    name: ticketData.nama || ticketData.name || "",
                    address: ticketData.alamat || ticketData.address || "",
                    description: ticketData.kendala || ticketData.description || "",
                    priority: ticketData.priority || "Low",
                    ticketRef: ticketData.id || ticketData.ticketId || "",
                    olt_name: ticketData.olt_name || "",
                    user_pppoe: ticketData.user_pppoe || "",
                    onu_sn: ticketData.sn_modem || ticketData.onu_sn || "",
                    interface: ticketData.interface || "",
                    type: ticketData.type || "FREE",
                    action_ticket: "-",
                    action_close: ticketData.action_close || "-",
                    last_action: ticketData.last_action || "-",
                    service_impact: ticketData.service_impact || "-",
                    root_cause: ticketData.root_cause || "-",
                    network_impact: ticketData.network_impact || "-",
                    person_in_charge: ticketData.person_in_charge || "-",
                    recomended_action: ticketData.recomended_action || "-",
                    PIC: ticketData.PIC || "-"
                });

                if (ticketData.nama || ticketData.name) {
                    useTicketStore.getState().fetchCustomerByName(ticketData.nama || ticketData.name);
                }
            }
        }
    }, [isOpen, mode, ticketData]);

    useEffect(() => {
        if (step === 2 && formData && formData.name) {
            form.reset(formData);
        }
    }, [step, formData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isOpen && mode === 'create' && step === 1) searchCustomers(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, isOpen, step, mode]);

    const handleClose = () => {
        onClose();
        setTimeout(() => { resetStore(); resetSearch(); }, 200);
    };

    const handleChangeUser = () => {
        resetStore();
        resetSearch();
        setStep(1);
    };

    const handleSelectCustomer = (c: any) => {
        selectUser({
            id: c.id, name: c.name, email: c.user_pppoe, role: 'user',
            alamat: c.alamat, user_pppoe: c.user_pppoe, onu_sn: c.onu_sn, olt_name: c.olt_name
        } as any);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                
                {/* 1. HEADER (Fixed) */}
                <DialogHeader className="px-6 py-4 border-b bg-card/50">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* 2. BODY (Scrollable) */}
                <div className="flex-1 overflow-y-auto">
                    {/* Step 1: Search (Only for Open Ticket) */}
                    {step === 1 && mode === 'create' && (
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Find Customer</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" placeholder="Search..." autoFocus />
                                </div>
                            </div>
                            <div className="space-y-1">
                                {isSearching && <div className="text-xs text-center p-4">Searching...</div>}
                                {searchResults.map((c) => (
                                    <div key={c.id} onClick={() => handleSelectCustomer(c)} className="p-2 hover:bg-muted rounded cursor-pointer flex gap-3 items-center">
                                        <Avatar className="h-8 w-8 text-xs"><AvatarFallback>{c.name?.[0]}</AvatarFallback></Avatar>
                                        <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.user_pppoe}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: The Unified Form */}
                    {(step === 2 || mode !== 'create') && (
                        <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {selectedUser && (
                                <CustomerCard
                                    user={selectedUser}
                                    onChangeUser={mode === 'create' ? handleChangeUser : undefined}
                                />
                            )}
                            <div className="mt-4">
                                <FormProvider value={form}>
                                    <FormFields />
                                </FormProvider>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. FOOTER (Fixed) */}
                {(step === 2 || mode !== 'create') && (
                    <DialogFooter className="p-6 pt-4 border-t bg-background">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            disabled={mutation.isPending}
                            variant={variant}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                submitLabel
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};