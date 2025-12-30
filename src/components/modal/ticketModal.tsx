import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "~/components/ui/dialog";
import { toast } from 'sonner';

// Hooks & Stores
import { useDebouncedValue } from '~/hooks/useDebounce';
import { useTicketStore, type TicketMode } from '~/store/ticketStore';
import { useCustomersView } from '~/features/customer/customer.hooks';
import { useAppForm, FormProvider } from '~/components/form/hooks'
import { useActionSuccess, useActionError } from '~/hooks/useActionLogs';
import { useTicketForm } from '~/store/ticketForm';

// Components (Assuming this exists)
import { CustomerCard } from '../customerCard';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: TicketMode;
    ticketData?: any;
}

export const TicketModal = ({ isOpen, onClose, mode, ticketData }: TicketModalProps) => {

    // 1. Get Store Data
    // Note: We don't need search logic from the store anymore, just the Selection logic
    const { step, setStep, selectUser, selectedUser, formData, initializeFromTicket, reset: resetStore } = useTicketStore();

    // 2. Local Search State (Managed by React Query now)
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

    // The Hook handles the fetching automatically!
    const { data: searchResults = [], isLoading: isSearching } = useCustomersView(debouncedSearchTerm);

    // 3. Strategy & Actions
    const { title, FormFields, submitLabel, variant, execute } = useTicketForm(mode);
    const onSuccessAction = useActionSuccess();
    const onErrorAction = useActionError();

    // 4. Setup Form Engine
    const form = useAppForm({
        defaultValues: {
            name: '', address: '', description: '', priority: 'Low', olt_name: '',
            user_pppoe: '', onu_sn: '', interface: '', ticketRef: '', type: 'FREE',
            action_ticket: '', action_close: '', last_action: '', service_impact: '',
            root_cause: '', network_impact: '', person_in_charge: '', recomended_action: '', PIC: ''
        },
        // No validators - form is gimmick, backend handles validation
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
                console.error(error);
                toast.error("An error occurred");
                console.error(error);
                onErrorAction(error as any, mode === 'create' ? "create" : "update", "ticket");
            }
        }
    });

    // 5. LIFECYCLE: DATA INITIALIZATION
    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                resetStore();
                setSearchTerm(""); // Reset local search
                form.reset();
                setStep(1);
            } else if (ticketData) {
                initializeFromTicket(ticketData);

                // Hydrate Form (Shortened for brevity - logic remains the same)
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
                    action_ticket: "-", action_close: ticketData.action_close || "-",
                    last_action: ticketData.last_action || "-", service_impact: ticketData.service_impact || "-",
                    root_cause: ticketData.root_cause || "-", network_impact: ticketData.network_impact || "-",
                    person_in_charge: ticketData.person_in_charge || "-", recomended_action: ticketData.recomended_action || "-",
                    PIC: ticketData.PIC || "-"
                });

                if (ticketData.nama || ticketData.name) {
                    useTicketStore.getState().fetchCustomerByName(ticketData.nama || ticketData.name);
                }
            }
        }
    }, [isOpen, mode, ticketData]);

    // Sync Store Data to Form (e.g. after selecting a user)
    useEffect(() => {
        if (step === 2 && formData && formData.name) {
            form.reset({
                ...formData,

                // Then FORCE overrides for every nullable field to ensure they are Strings
                name: formData.name || '',
                address: formData.address || '',
                description: formData.description || '',

                // Technical
                olt_name: formData.olt_name || '',
                user_pppoe: formData.user_pppoe || '',
                onu_sn: formData.onu_sn || '',
                interface: formData.interface || '',

                // Meta & Enums (Provide safe defaults!)
                ticketRef: formData.ticketRef || '',
                priority: formData.priority || 'Low',
                type: formData.type || 'FREE',

                // Actions / Hidden fields
                action_ticket: formData.action_ticket || '',
                action_close: formData.action_close || '',
                last_action: formData.last_action || '',
                service_impact: formData.service_impact || '',
                root_cause: formData.root_cause || '',
                network_impact: formData.network_impact || '',
                person_in_charge: formData.person_in_charge || '',
                recomended_action: formData.recomended_action || '',
                PIC: formData.PIC || ''
            });
        }
    }, [step, formData]);


    const handleClose = () => {
        onClose();
        setTimeout(() => {
            resetStore();
            setSearchTerm("");
        }, 200);
    };

    const handleChangeUser = () => {
        resetStore();
        setSearchTerm("");
        setStep(1);
    };

    const handleSelectCustomer = (c: any) => {
        selectUser(c);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            {/* Layout: Fixed Header/Footer, Scrollable Body */}
            <DialogContent className="max-w-2xl max-h-[100vh] flex flex-col p-0 gap-0 overflow-hidden">

                {/* 1. HEADER */}
                <DialogHeader className="px-6 py-4 border-b bg-card/50">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* 2. BODY */}
                <div className="flex-1 overflow-y-auto">
                    {/* Step 1: Search */}
                    {step === 1 && mode === 'create' && (
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Find Customer</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                        placeholder="Search name, pppoe, address..."
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                {isSearching && <div className="text-xs text-center p-4">Searching...</div>}
                                {searchResults.map((c) => (
                                    <div key={c.id} onClick={() => handleSelectCustomer(c)} className="p-2 hover:bg-muted rounded cursor-pointer flex gap-3 items-center">
                                        <Avatar className="h-8 w-8 text-xs">
                                            <AvatarFallback>{(c.nama || c.name)?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{c.nama || c.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {c.user_pppoe} • {c.alamat}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Form */}
                    {(step === 2 || mode !== 'create') && (
                        <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {selectedUser && (
                                <CustomerCard
                                    user={{
                                        id: selectedUser.id?.toString() || '',
                                        name: selectedUser.nama || selectedUser.name || '',
                                        user_pppoe: selectedUser.user_pppoe || '',
                                        pass_pppoe: selectedUser.pppoe_password || undefined,
                                        alamat: selectedUser.alamat || '',
                                        onu_sn: selectedUser.onu_sn || '',
                                        olt_name: selectedUser.olt_name || '',
                                        olt_port: selectedUser.olt_port || '',
                                        interface: selectedUser.interface || '',
                                        paket: selectedUser.paket || '',
                                        snmp_status: selectedUser.snmp_status as 'active' | 'inactive' | 'dyinggasp' | undefined,
                                        rx_power_str: selectedUser.rx_power_str || '',
                                        modem_type: selectedUser.modem_type || '',
                                        snmp_last_updated: selectedUser.snmp_last_updated || '',
                                        latest_kendala: selectedUser.latest_kendala || '',
                                        latest_ticket: selectedUser.latest_tiket || '',
                                        latest_action: selectedUser.latest_action || '',
                                        coordinates: undefined
                                    }}
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

                {/* 3. FOOTER */}
                {(step === 2 || mode !== 'create') && (
                    <DialogFooter className="p-6 pt-4 border-t bg-background">
                        <Button variant="outline" onClick={handleClose} disabled={form.state.isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            disabled={form.state.isSubmitting}
                            variant={variant}
                        >
                            {form.state.isSubmitting ? (
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