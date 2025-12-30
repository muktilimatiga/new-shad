import { z } from 'zod';
import { create } from 'zustand';
import type { Customer } from '~/@types/types';
import { useAppStore } from '~/hooks/store';
import { listCustomersView } from '~/features/customer/customer.api';
import type { CustomerView } from '~/features/customer/customer.types';
import { TicketCompatibilitySchema } from '~/components/form/TicketFormField';



export type TicketMode = 'create' | 'open' | 'forward' | 'close';

export type TicketFormData = z.infer<typeof TicketCompatibilitySchema>;

// 2. Default Values (Clean Slate)
const INITIAL_FORM_DATA: TicketFormData = {
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
};

interface TicketStore {
    // State
    step: number;
    selectedUser: CustomerView | null;
    formData: TicketFormData;

    // Actions
    setStep: (step: number) => void;
    selectUser: (user: CustomerView) => void;
    initializeFromTicket: (ticket: any) => void;
    fetchCustomerByName: (name: string) => Promise<void>; // Uses API directly
    reset: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
    // Initial State
    step: 1,
    selectedUser: null,
    formData: INITIAL_FORM_DATA,
    setStep: (step) => set({ step }),

    // Select Customer Actions
    selectUser: (customer) => {
        const randomRef = `TN${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`;
        set({
            selectedUser: customer,
            step: 2,
            formData: {
                ...INITIAL_FORM_DATA,
                name: (customer.nama || customer.name)?.toUpperCase() || '',
                address: customer.alamat || '',
                user_pppoe: customer.user_pppoe || '',
                onu_sn: customer.onu_sn || '',
                olt_name: customer.olt_name || '',
                interface: customer.interface || '',
                ticketRef: randomRef,
                priority: 'Low',
                type: 'FREE',
                PIC: useAppStore.getState().user?.name || ''
            }
        });
    },


    // --- 1.5 Fetch Customer By Name (For initializing existing tickets) ---
    fetchCustomerByName: async (nama: string) => {
        if (!nama) return;
        try {
            // Reusing your listCustomersView API
            const results = await listCustomersView({ searchTerm: nama, limit: 1 }); //
            const data = results[0];

            if (data) {
                set((state) => ({
                    selectedUser: data,
                    formData: {
                        ...state.formData,
                        name: data.nama || data.name || state.formData.name,
                        address: data.alamat || state.formData.address,
                        user_pppoe: data.user_pppoe || state.formData.user_pppoe,
                        onu_sn: data.onu_sn || state.formData.onu_sn,
                        olt_name: data.olt_name || state.formData.olt_name,
                    }
                }));
            }
        } catch (err) {
            console.error("Failed to hydrate customer:", err);
        }
    },


    // --- 3. Initialize Logic (For Edit / Forward / Close Modes) ---
    initializeFromTicket: (ticket: any) => {
        // This function prepares the store when you click "Forward" on an EXISTING ticket
        set({
            step: 2, // Skip Search, go straight to form
            selectedUser: {
                id: ticket.customerId || 'unknown',
                name: ticket.name || 'Customer'
            } as any,

            formData: {
                ...INITIAL_FORM_DATA,
                ticketRef: ticket.ticketRef || ticket.id,
                name: ticket.name || '',
                address: ticket.address || '',
                description: ticket.kendala || '',
                last_action: ticket.last_action || 'cek',

                olt_name: ticket.olt_name || '',
                user_pppoe: ticket.user_pppoe || '',
                onu_sn: ticket.onu_sn || '',
                interface: ticket.interface || '',

                priority: ticket.priority || 'Low',
                type: ticket.type || 'FREE',
                person_in_charge: ticket.person_in_charge || 'ALL TECHNICIAN',
                PIC: useAppStore.getState().user?.name || ticket.PIC || '',

                // Ensure action fields are clean
                action_close: '',
                recomended_action: '',
                root_cause: ''
            }
        });
        if (ticket.nama) useTicketStore.getState().fetchCustomerByName(ticket.nama);
    },

    reset: () => set({
        step: 1,
        selectedUser: null,
        formData: INITIAL_FORM_DATA,
    })
}));