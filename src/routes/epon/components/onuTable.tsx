
import React, { useMemo, useState } from 'react';
import { OnuData } from '~/@types/types';
import { RefreshCcw, ChevronLeft, ChevronRight, Trash2, Power, PowerOff } from 'lucide-react';
import { cn } from '~/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";

interface OnuTableProps {
    data: OnuData[];
    onRefresh: () => void;
    searchTerm: string;
}

const ITEMS_PER_PAGE = 10;

const OnuTable: React.FC<OnuTableProps> = ({ data, onRefresh, searchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredData = useMemo(() => {
        // Note: In a real app, selection might clear on search. Here we keep it simple.
        // setCurrentPage(1); // Removed to avoid reset loop if search changes while typing
        if (!searchTerm) return data;
        const lowerTerm = searchTerm.toLowerCase();
        return data.filter(item =>
            item.name.toLowerCase().includes(lowerTerm) ||
            item.id.toLowerCase().includes(lowerTerm) ||
            item.macAddress.toLowerCase().includes(lowerTerm)
        );
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    // Selection Handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // Select all IDs visible in filteredData (or just current page depending on preference)
            // Let's select ALL filtered data for "Select All" behavior
            const newSelected = new Set(filteredData.map(item => item.id));
            setSelectedIds(newSelected);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    const isAllSelected = filteredData.length > 0 && selectedIds.size === filteredData.length;
    const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < filteredData.length;

    return (
        <div className="h-full flex flex-col space-y-4 p-8">
            {/* Header / Toolbar Area */}
            <div className="flex items-center justify-between space-y-2 min-h-[50px]">
                {selectedIds.size > 0 ? (
                    <div className="flex items-center w-full justify-between bg-primary/10 p-2 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-4 px-2">
                            <span className="font-semibold text-primary">{selectedIds.size} selected</span>
                            <div className="h-4 w-px bg-primary/20" />
                            <div className="flex gap-2">
                                <Button size="sm" variant="destructive" className="h-8">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
                                    <PowerOff className="mr-2 h-4 w-4" />
                                    Deactivate
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
                                    <Power className="mr-2 h-4 w-4" />
                                    Reboot
                                </Button>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">ONU Management</h2>
                            <p className="text-muted-foreground">
                                Manage and monitor connected Optical Network Units.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" onClick={onRefresh} size="sm">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Refresh
                            </Button>
                            <Button size="sm">Download Report</Button>
                        </div>
                    </>
                )}
            </div>

            <Card className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>MAC Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Firmware</TableHead>
                                <TableHead>Chip ID</TableHead>
                                <TableHead className="text-right">Ports</TableHead>
                                <TableHead className="text-right">RTT (ms)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row) => {
                                    const isSelected = selectedIds.has(row.id);
                                    return (
                                        <TableRow key={row.id} data-state={isSelected ? "selected" : undefined}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                                                    aria-label={`Select row ${row.id}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{row.macAddress}</TableCell>
                                            <TableCell>
                                                <div className={cn(
                                                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                                    row.status === 'Up'
                                                        ? "border-transparent bg-green-500/15 text-green-700 dark:text-green-400"
                                                        : "border-transparent bg-red-500/15 text-red-700 dark:text-red-400"
                                                )}>
                                                    {row.status}
                                                </div>
                                            </TableCell>
                                            <TableCell>{row.fwVersion}</TableCell>
                                            <TableCell>{row.chipId}</TableCell>
                                            <TableCell className="text-right">{row.ports}</TableCell>
                                            <TableCell className="text-right font-mono">{row.rtt}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-card">
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredData.length)}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</strong> of <strong>{filteredData.length}</strong> results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center justify-center text-sm font-medium">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="h-8 w-8 p-0"
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OnuTable;
