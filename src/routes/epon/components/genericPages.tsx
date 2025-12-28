
import React, { useState } from 'react';
import { RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

export interface ColumnDef<T> {
    header: string;
    accessorKey: keyof T;
    className?: string;
    cell?: (item: T) => React.ReactNode;
}

interface GenericPageProps<T> {
    title: string;
    description?: string;
    data: T[];
    columns: ColumnDef<T>[];
    onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 10;

const GenericPage = <T extends object>({
    title,
    description,
    data,
    columns,
    onRefresh
}: GenericPageProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);

    const paginatedData = data
        ? data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : [];

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    return (
        <div className="h-full flex flex-col space-y-4 p-8 animate-in fade-in duration-300 text-foreground">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    {description && (
                        <p className="text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {onRefresh && (
                        <Button variant="outline" onClick={onRefresh} size="sm">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    )}
                </div>
            </div>

            <Card className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableHead key={index} className={col.className}>
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={`${rowIndex}-${colIndex}`} className={col.className}>
                                                {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {data && data.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-card">
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, data.length)}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, data.length)}</strong> of <strong>{data.length}</strong> results
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
                                Page {currentPage} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GenericPage;
