
import React, { useMemo } from 'react';
import { Customer } from '~/@types/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Phone, Mail, MapPin, Network, Calendar, CreditCard, MoreHorizontal, User, Activity } from 'lucide-react';
import { cn } from '~/lib/utils';

interface CustomerViewProps {
    data: Customer[];
    searchTerm: string;
    onRefresh?: () => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ data, searchTerm, onRefresh }) => {
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowerTerm = searchTerm.toLowerCase();
        return data.filter(item =>
            item.name.toLowerCase().includes(lowerTerm) ||
            item.id.toLowerCase().includes(lowerTerm) ||
            item.email.toLowerCase().includes(lowerTerm)
        );
    }, [data, searchTerm]);

    return (
        <div className="h-full flex flex-col space-y-4 p-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your subscriber base and subscriptions.</p>
                </div>
                <Button onClick={onRefresh} variant="outline" size="sm">
                    Refresh List
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
                {filteredData.map((customer) => (
                    <CustomerCard key={customer.id} customer={customer} />
                ))}
                {filteredData.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground">
                        <User className="h-12 w-12 mb-4 opacity-20" />
                        <p>No customers found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomerCard: React.FC<{ customer: Customer }> = ({ customer }) => {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-base font-semibold leading-none">
                        {customer.name}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">{customer.id}</span>
                </div>
                <div className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                    customer.status === 'Active' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        customer.status === 'Suspended' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                )}>
                    {customer.status}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pt-4">
                <div className="grid grid-cols-[16px_1fr] gap-2 items-center text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate" title={customer.address}>{customer.address}</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] gap-2 items-center text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] gap-2 items-center text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate" title={customer.email}>{customer.email}</span>
                </div>

                <div className="border-t border-border my-2 pt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Network className="h-3 w-3" /> ONU ID
                        </span>
                        <span className="font-mono">{customer.onuId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Activity className="h-3 w-3" /> Plan
                        </span>
                        <span className="font-medium">{customer.plan}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Joined
                        </span>
                        <span>{customer.joinedDate}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4 px-6 border-t border-border bg-muted/20 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Balance</span>
                    <span className={cn(
                        "text-sm font-bold",
                        customer.balance.includes('-') || customer.balance === 'IDR 0' || customer.balance === '$0.00'
                            ? "text-foreground"
                            : "text-red-600 dark:text-red-400"
                    )}>
                        {customer.balance}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                        View
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default CustomerView;
