import React from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useTheme } from './theme-provider';

interface TopHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ searchTerm, onSearchChange }) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="h-16 w-full bg-background border-b border-border z-20 sticky top-0 flex items-center justify-between px-6 shadow-sm">
            {/* Logo Area */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    {/* Logo with Primary Color */}
                    <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-primary-foreground font-bold text-lg">H</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">HIOSO</span>
                </div>

                <div className="hidden md:flex items-center">
                    <span className="h-4 w-px bg-border mx-4"></span>
                    <span className="text-sm font-medium text-muted-foreground">EPON Management</span>
                </div>
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search Bar */}
                <div className="relative w-64 md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 h-9 bg-muted/30 border-input/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                        <Bell className="h-4 w-4" />
                    </Button>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;