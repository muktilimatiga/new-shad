
import React from 'react';
import { MenuItem } from '~/@types/types';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { ChevronRight, ChevronDown, Monitor, Network, Settings, BarChart2, Shield, Users } from 'lucide-react';

interface SidebarProps {
    menuItems: MenuItem[];
    selectedId: string;
    onSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, selectedId, onSelect }) => {

    // Icon mapping helper
    const getIcon = (id: string) => {
        if (id === 'system') return <Monitor className="w-4 h-4 mr-2" />;
        if (id === 'customers') return <Users className="w-4 h-4 mr-2" />;
        if (id.includes('onu')) return <Network className="w-4 h-4 mr-2" />;
        if (id.includes('config')) return <Settings className="w-4 h-4 mr-2" />;
        if (id.includes('statistic')) return <BarChart2 className="w-4 h-4 mr-2" />;
        return <Shield className="w-4 h-4 mr-2" />;
    };

    const renderMenuItem = (item: MenuItem, depth = 0) => {
        const isSelected = item.id === selectedId;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id} className="flex flex-col w-full mb-1">
                <Button
                    variant="sidebar"
                    size="sm"
                    className={cn(
                        "w-full justify-start font-normal transition-all duration-200",
                        depth > 0 && "pl-8",
                        // Base Colors (Unselected) - Explicitly setting dark mode colors for light mode context
                        !isSelected && "text-zinc-300 hover:text-white hover:bg-zinc-800",
                        // Active State: Bright Green Background, White Text
                        isSelected && "bg-green-600 text-white hover:bg-green-500 hover:text-white font-medium shadow-md"
                    )}
                    onClick={() => {
                        if (!hasChildren) onSelect(item.id);
                    }}
                >
                    {depth === 0 && getIcon(item.id)}
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {hasChildren && (
                        item.isOpen ? <ChevronDown className="w-3 h-3 ml-2 opacity-70" /> : <ChevronRight className="w-3 h-3 ml-2 opacity-70" />
                    )}
                </Button>

                {item.isOpen && item.children && (
                    <div className="flex flex-col w-full mt-1 relative">
                        {/* Optional connecting line for nested items */}
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800 hidden" />
                        {item.children.map(child => renderMenuItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="w-64 bg-[#111827] h-full border-r border-zinc-800 flex-shrink-0 flex flex-col pt-6">
            <div className="px-4 py-2">
                <h2 className="mb-4 px-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Platform
                </h2>
                <nav className="flex flex-col space-y-1">
                    {menuItems.map(item => renderMenuItem(item))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
