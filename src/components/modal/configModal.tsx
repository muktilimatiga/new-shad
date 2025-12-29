import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "~/components/ui/dialog"; 
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

import { toast } from "sonner"
import { X, RefreshCw, Trash2, Layers } from 'lucide-react';
import { cn } from '~/lib/utils';

// Hooks
import { useDebouncedValue } from '~/hooks/useDebounce';
import { useConfigStore } from '~/store/configStore';
import { useAppForm, FormProvider } from '~/components/form/hooks';
import { usePsbData, useScanOnts } from '~/services/useApi';
import { useConfigMutation } from '~/services/configMutation';

import { useCustomersView } from '~/features/customer/customer.hooks';

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'manual' | 'auto' | 'batch' | 'bridge';
}

const EffectSync = ({ value, onChange }: { value: any, onChange: (val: any) => void }) => {
    useEffect(() => {
        if (typeof value !== 'undefined') onChange(value);
    }, [value, onChange]);
    return null;
};

export const ConfigModal = ({ isOpen, onClose, type }: ConfigModalProps) => {

    // 1. Store State
    const {
        mode, setMode, selectedOlt, setSelectedOlt,
        batchQueue, addToBatch, removeFromBatch,
        detectedOnts, setDetectedOnts,
        reset
    } = useConfigStore();

    // 2. Local Search State (Replaces useFiberStore)
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);

    // ✅ 3. THE NEW DATA SOURCE
    // This handles loading, error, and caching automatically using React Query
    const { 
        data: searchResults = [], 
        isFetching: isSearchingCustomers,
        refetch: refetchCustomers 
    } = useCustomersView(debouncedSearchTerm); //

    // 4. Other APIs
    const {
        data: psbList,
        refetch: refetchPsb,
        isRefetching: isRefetchingPsb,
    } = usePsbData();

    const { mutateAsync: scanOnts, isPending: isScanning } = useScanOnts();
    
    const currentType = type === 'batch' ? 'batch' : type === 'bridge' ? 'bridge' : mode;
    const { FormFields, schema, execute, submitLabel } = useConfigMutation(currentType, selectedOlt);

    const handleClose = () => {
        onClose();
        setTimeout(() => reset(), 200);
    };

    // 5. Form Engine
    const form = useAppForm({
        defaultValues: {
            olt_name: '', modem_type: '', onu_sn: '', package: '',
            name: '', address: '', user_pppoe: '',
            pass_pppoe: '',
            eth_locks: [true],
            vlan_id: '',
            data_psb: '',
            fiber_source_id: ''
        },
        validators: { onChange: schema },
        onSubmit: async ({ value }) => {
            if (!value.olt_name) return toast.error("Please select an OLT");

            try {
                if (currentType === 'batch') {
                    // @ts-ignore
                    await execute(value, batchQueue);
                } else {
                    await execute(value);
                }
                toast.success("Configuration started");
                handleClose();
            } catch (error: any) {
                toast.error(error.message || "Failed");
            }
        }
    });

    // 6. Handler: Select User from Search Results
    const handleSelectUser = (data: any) => {
        let selected: any = null;

        // Determine if 'data' is the full object or just the ID string
        if (typeof data === 'object' && data !== null) {
            selected = data;
        } else {
            // Find in our new React Query results
            selected = searchResults?.find(p => p.user_pppoe === data);
        }

        if (selected) {
            form.setFieldValue('name', selected.name || '');
            form.setFieldValue('address', selected.alamat || '');
            form.setFieldValue('user_pppoe', selected.user_pppoe || '');
            // Note: Check if 'pppoe_password' exists in your view, otherwise map correctly
            form.setFieldValue('pass_pppoe', selected.pppoe_password || selected.pass_pppoe || '');
            
            // Optional: Reset search after selection
            setSearchTerm('');
        }
    };

    const handleSelectPsb = (value: string) => {
        const selected = psbList?.find((p: any) => p.user_pppoe === value || p.id === value);
        if (selected) {
            form.setFieldValue('name', selected.name || '');
            form.setFieldValue('address', selected.address || '');
            form.setFieldValue('user_pppoe', selected.user_pppoe || '');
            form.setFieldValue('pass_pppoe', selected.pppoe_password || '');
            if (selected.paket) form.setFieldValue('package', selected.paket);
        }
    };

    const handleScan = async () => {
        if (!selectedOlt) return toast.error("Select OLT first");
        try {
            const res = await scanOnts(selectedOlt);
            setDetectedOnts(res || []);
            if (currentType !== 'batch' && res?.length) form.setFieldValue('onu_sn', res[0].sn);
            toast.success(`Found ${res?.length || 0} devices`);
        } catch {
            toast.error("Scan failed");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-2xl">
                
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b flex flex-row justify-between items-center space-y-0 bg-white dark:bg-zinc-900">
                    <DialogTitle className="text-lg font-bold">
                        {mode === 'manual' ? 'Manual' : 'Auto (API)'}
                    </DialogTitle>
                    
                    <div className="flex items-center gap-4">
                        {type !== 'batch' && type !== 'bridge' && (
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 p-1 pr-3 rounded-full border">
                                <Switch checked={mode === 'manual'} onCheckedChange={(c) => setMode(c ? 'manual' : 'auto')} className="scale-75" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    {mode === 'manual' ? 'Manual' : 'Auto'}
                                </span>
                            </div>
                        )}
                        <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[75vh]">
                    <FormProvider value={form}>
                        {/* Sync OLT */}
                        <form.Subscribe
                            selector={(state) => state.values.olt_name}
                            children={(olt) => <EffectSync value={olt} onChange={setSelectedOlt} />}
                        />
                        
                        {/* Sync PSB Selection */}
                        <form.Subscribe
                            selector={(state) => state.values.data_psb}
                            children={(selectedId) => {
                                useEffect(() => {
                                    if (selectedId && psbList) handleSelectPsb(selectedId);
                                }, [selectedId, psbList]);
                                return null;
                            }}
                        />

                        <FormFields
                            mode={currentType}
                            detectedOnts={detectedOnts}
                            onScan={handleScan}
                            isScanning={isScanning}
                            
                            // Auto Mode Props
                            psbList={psbList}
                            fetchPsbData={refetchPsb}
                            isFetchingPSB={isRefetchingPsb}
                            selectPSBList={handleSelectPsb}
                            
                            // ✅ Manual Mode Props (Now using React Query)
                            selectUser={handleSelectUser}
                            fiberList={searchResults}         // Data from useCustomersView
                            fiberSearchTerm={searchTerm}      // Local state
                            setFiberSearchTerm={setSearchTerm}// Local setter
                            isSearchingFiber={isSearchingCustomers} // Loading state
                            onFiberSearch={() => refetchCustomers()} // Trigger (optional due to debounce)
                        />
                    </FormProvider>

                    {/* Batch Queue UI */}
                    {type === 'batch' && (
                        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-end">
                                <h3 className="text-xs font-bold uppercase text-slate-500">Queue ({batchQueue.length})</h3>
                                <Button variant="outline" size="sm" onClick={handleScan} disabled={isScanning} className="h-8 text-xs">
                                    <RefreshCw className={cn("h-3 w-3 mr-2", isScanning && "animate-spin")} />
                                    Scan
                                </Button>
                            </div>

                            {/* Add to Queue */}
                            {detectedOnts.length > 0 && (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in">
                                    <select
                                        className="w-full text-xs bg-transparent border-none outline-none text-blue-700 font-medium cursor-pointer"
                                        onChange={(e) => {
                                            const sn = e.target.value;
                                            if (!sn) return;
                                            const ont = detectedOnts.find(o => o.sn === sn);
                                            if (ont) addToBatch(ont);
                                            e.target.value = "";
                                        }}
                                    >
                                        <option value="">+ Add Detected Device to Queue...</option>
                                        {detectedOnts.map(ont => (
                                            <option key={ont.sn} value={ont.sn} disabled={!!batchQueue.find(b => b.sn === ont.sn)}>
                                                {ont.sn} (Port {ont.pon_port || '?'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Queue List */}
                            <div className="border rounded-lg overflow-hidden bg-slate-50/50 min-h-[150px]">
                                {batchQueue.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                                        <Layers className="h-8 w-8 opacity-20" />
                                        <p className="text-xs">Queue is empty</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {batchQueue.map((item, idx) => (
                                            <div key={item.sn} className="flex items-center justify-between p-2.5 bg-white text-xs hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-mono font-bold text-slate-700">{item.sn}</div>
                                                        <div className="text-[10px] text-slate-400">Port {item.port}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromBatch(item.sn)}
                                                    className="h-6 w-6 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t flex justify-end gap-3 bg-slate-50/30">
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={(e) => { e.preventDefault(); form.handleSubmit(); }} 
                        disabled={form.state.isSubmitting} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    >
                        {form.state.isSubmitting ? "Processing..." : submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};