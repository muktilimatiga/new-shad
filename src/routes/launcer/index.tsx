import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '~/lib/utils'
import { TicketModal } from '@/components/modal/openTicketModal'
import { useAppStore } from '~/hooks/store'
import { APPS_CONFIG } from './components/apps'
import { AddItemMenu } from './components/addMenutItem'
import { ConfigModalTest } from '@/components/modal/configModalTest'

export const Route = createFileRoute('/launcher/')({
    component: Launcher,
})

export function Launcher() {
    const { setCreateTicketModalOpen, isCreateTicketModalOpen } = useAppStore();
    
    // State for the configuration modals
    const [modalType, setModalType] = useState<'none' | 'config' | 'config_bridge' | 'config_batch'>('none');
    
    // State for the "Add New Item" menu
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    // This function acts as the "Switchboard"
    // It closes the menu first, then opens the requested modal
    const openModal = (type: string) => {
        setIsAddMenuOpen(false); // Ensure menu is closed

        if (type === 'create_ticket') {
            setCreateTicketModalOpen(true);
        } else {
            // TypeScript safe casting if needed, or update setModalType to accept string
            setModalType(type as any);
        }
    };

    return (
        <div className="p-8 md:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-500 py-8">
            
            {/* --- MODALS SECTION --- */}
            
            {/* 1. Manual Config */}
            <ConfigModalTest
                isOpen={modalType === 'config'}
                onClose={() => setModalType('none')}
                type="manual"
            />

            {/* 2. Bridge Config */}
            <ConfigModalTest
                isOpen={modalType === 'config_bridge'}
                onClose={() => setModalType('none')}
                type="bridge"
            />

            {/* 3. Batch Config */}
            <ConfigModalTest
                isOpen={modalType === 'config_batch'}
                onClose={() => setModalType('none')}
                type="batch"
            />

            {/* 4. Ticket Modal (Only one instance needed) */}
            <TicketModal
                isOpen={isCreateTicketModalOpen}
                onClose={() => setCreateTicketModalOpen(false)}
                mode="create"
            />

            {/* 5. The Add Menu (Hidden by default, controlled by isAddMenuOpen) */}
            <AddItemMenu 
                isOpen={isAddMenuOpen} 
                onOpenChange={setIsAddMenuOpen} 
                onSelect={openModal} 
            />

            {/* --- GRID LAYOUT SECTION --- */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
                {APPS_CONFIG.map((app) => {
                    const CardContent = (
                        <div className={cn(
                            "h-60 flex flex-col items-center justify-center p-8 rounded-3xl transition-all duration-300 relative overflow-hidden",
                            app.color,
                            app.isAction && "cursor-pointer",
                        )}>
                            <div className={cn(
                                "mb-6 transition-transform duration-300 group-hover:scale-110",
                                app.id === 'new' ? "mb-4" : ""
                            )}>
                                <app.icon strokeWidth={1.5} className={cn("w-10 h-10", app.iconColor)} />
                            </div>

                            <h3 className={cn(
                                "text-xl font-bold mb-2 tracking-tight",
                                app.isEmpty ? "text-muted-foreground" : "text-foreground"
                            )}>
                                {app.title}
                            </h3>

                            <p className={cn(
                                "text-sm font-medium",
                                app.isEmpty ? "text-muted-foreground/60" : "text-muted-foreground"
                            )}>
                                {app.subtitle}
                            </p>
                        </div>
                    );

                    // LOGIC: If the card ID is 'new', clicking it opens the Menu
                    if (app.id === 'new') {
                        return (
                            <div 
                                key={app.id} 
                                className="block outline-none cursor-pointer group select-none" 
                                onClick={() => setIsAddMenuOpen(true)}
                            >
                                {CardContent}
                            </div>
                        );
                    }

                    if (app.to) {
                        return (
                            <Link key={app.id} to={app.to} className="block group outline-none select-none">
                                {CardContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={app.id} className="block outline-none group select-none">
                            {CardContent}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}