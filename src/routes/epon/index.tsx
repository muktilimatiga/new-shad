
import React, { useState } from 'react';
import TopHeader from './components/TopHeader';
import Sidebar from './components/sidebar';
import OnuTable from './components/onuTable';
import CustomerView from './components/cutomersView';
import GenericPage, { ColumnDef } from './components/genericPages'
import { ThemeProvider } from './components/theme-provider';
import { cn } from '~/lib/utils';
import {
    SIDEBAR_MENU,
    MOCK_ONU_DATA,
    MOCK_SYSTEM_INFO,
    MOCK_PORT_DATA,
    MOCK_STATISTIC_DATA,
    MOCK_VLAN_DATA,
    MOCK_BANDWIDTH_DATA,
    MOCK_MAC_CONFIG,
    MOCK_AGGREGATION_DATA,
    MOCK_SNMP_DATA,
    MOCK_ATTEMPT_ONU_DATA,
    MOCK_ONU_CATV_DATA,
    MOCK_CUSTOMERS
} from '~/routes/epon/components/constant';

import { createFileRoute } from '@tanstack/react-router'

export const Epon: React.FC = () => {
    const [selectedMenuId, setSelectedMenuId] = useState<string>('all-onu');
    const [onuData, setOnuData] = useState(MOCK_ONU_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        // Simulate refresh
        setRefreshKey(prev => prev + 1);
    };

    const renderContent = () => {
        switch (selectedMenuId) {
            case 'system':
                return (
                    <GenericPage
                        title="System Information"
                        description="General system status and configuration details."
                        data={MOCK_SYSTEM_INFO}
                        columns={[
                            { header: 'Attribute', accessorKey: 'attribute', className: 'font-medium w-1/3' },
                            { header: 'Value', accessorKey: 'value' }
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'customers':
                return (
                    <CustomerView
                        data={MOCK_CUSTOMERS}
                        searchTerm={searchTerm}
                        onRefresh={handleRefresh}
                    />
                );

            case 'port-management':
                return (
                    <GenericPage
                        title="Port Management"
                        description="Configuration and status of OLT physical ports."
                        data={MOCK_PORT_DATA}
                        columns={[
                            { header: 'Port ID', accessorKey: 'portId', className: 'font-medium' },
                            { header: 'Type', accessorKey: 'type' },
                            { header: 'Speed', accessorKey: 'speed' },
                            {
                                header: 'Status',
                                accessorKey: 'status',
                                cell: (item) => (
                                    <span className={cn(
                                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                        item.status === 'Up' ? "bg-green-500/15 text-green-700 dark:text-green-400 border-transparent" : "bg-red-500/15 text-red-700 dark:text-red-400 border-transparent"
                                    )}>
                                        {item.status}
                                    </span>
                                )
                            },
                            { header: 'Flow Control', accessorKey: 'flowControl' },
                            { header: 'MTU', accessorKey: 'mtu' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'statistic':
                return (
                    <GenericPage
                        title="Port Statistics"
                        description="Real-time traffic statistics for all ports."
                        data={MOCK_STATISTIC_DATA}
                        columns={[
                            { header: 'Port ID', accessorKey: 'portId', className: 'font-medium' },
                            { header: 'TX Packets', accessorKey: 'txPackets', className: 'text-right' },
                            { header: 'RX Packets', accessorKey: 'rxPackets', className: 'text-right' },
                            { header: 'TX Bytes', accessorKey: 'txBytes', className: 'text-right' },
                            { header: 'RX Bytes', accessorKey: 'rxBytes', className: 'text-right' },
                            { header: 'Errors', accessorKey: 'errors', className: 'text-right text-red-500' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'vlan-config':
                return (
                    <GenericPage
                        title="VLAN Configuration"
                        description="Manage Virtual Local Area Networks."
                        data={MOCK_VLAN_DATA}
                        columns={[
                            { header: 'VLAN ID', accessorKey: 'vlanId', className: 'font-medium w-[100px]' },
                            { header: 'Description', accessorKey: 'description' },
                            { header: 'Type', accessorKey: 'type' },
                            { header: 'Tagged Ports', accessorKey: 'taggedPorts' },
                            { header: 'Untagged Ports', accessorKey: 'untaggedPorts' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'bandwidth-config':
                return (
                    <GenericPage
                        title="Bandwidth Control"
                        description="Manage bandwidth profiles and SLA for ONUs."
                        data={MOCK_BANDWIDTH_DATA}
                        columns={[
                            { header: 'ONU ID', accessorKey: 'onuId', className: 'font-medium' },
                            { header: 'SLA Profile', accessorKey: 'slaProfile' },
                            { header: 'Upstream BW', accessorKey: 'upstreamBw' },
                            { header: 'Downstream BW', accessorKey: 'downstreamBw' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'olt-mac-config':
                return (
                    <GenericPage
                        title="MAC Address Table"
                        description="Static and dynamic MAC address entries."
                        data={MOCK_MAC_CONFIG}
                        columns={[
                            { header: 'MAC Address', accessorKey: 'macAddress', className: 'font-mono' },
                            { header: 'VLAN ID', accessorKey: 'vlanId' },
                            { header: 'Port / System', accessorKey: 'portId' },
                            { header: 'Type', accessorKey: 'type' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'port-aggregation':
                return (
                    <GenericPage
                        title="Link Aggregation"
                        description="Configure LACP and manual link aggregation groups."
                        data={MOCK_AGGREGATION_DATA}
                        columns={[
                            { header: 'Group ID', accessorKey: 'groupId', className: 'font-medium' },
                            { header: 'Load Balance Policy', accessorKey: 'policy' },
                            { header: 'Master Port', accessorKey: 'masterPort' },
                            { header: 'Member Ports', accessorKey: 'memberPorts', cell: (item) => item.memberPorts.join(', ') },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'snmp-config':
                return (
                    <GenericPage
                        title="SNMP Configuration"
                        description="Simple Network Management Protocol settings."
                        data={MOCK_SNMP_DATA}
                        columns={[
                            { header: 'Community', accessorKey: 'community', className: 'font-mono' },
                            { header: 'Access', accessorKey: 'access' },
                            { header: 'View Name', accessorKey: 'viewName' },
                            { header: 'Status', accessorKey: 'status' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            // ONU Management Sub-pages
            case 'onu-catv':
                return (
                    <GenericPage
                        title="ONU CATV Status"
                        description="Cable TV signal status for supported ONUs."
                        data={MOCK_ONU_CATV_DATA}
                        columns={[
                            { header: 'ONU ID', accessorKey: 'onuId', className: 'font-medium' },
                            {
                                header: 'State',
                                accessorKey: 'state',
                                cell: (item) => (
                                    <span className={cn(
                                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                        item.state === 'On' ? "bg-green-500/15 text-green-700 dark:text-green-400 border-transparent" : "bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border-transparent"
                                    )}>
                                        {item.state}
                                    </span>
                                )
                            },
                            { header: 'Input Power', accessorKey: 'inputPower' },
                            { header: 'Output Level', accessorKey: 'outputLevel' },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'attempt-onu':
                return (
                    <GenericPage
                        title="Attempting ONUs"
                        description="ONUs that are physically connected but not yet authenticated."
                        data={MOCK_ATTEMPT_ONU_DATA}
                        columns={[
                            { header: 'ID', accessorKey: 'id', className: 'font-medium' },
                            { header: 'MAC Address', accessorKey: 'macAddress', className: 'font-mono' },
                            { header: 'Status', accessorKey: 'status', cell: () => <span className="text-yellow-600 font-medium">Attempting</span> },
                        ]}
                        onRefresh={handleRefresh}
                    />
                );

            case 'authed-onu':
                // Reuse All ONU data but filter for this example or just show all
                return <OnuTable data={MOCK_ONU_DATA} onRefresh={handleRefresh} searchTerm={searchTerm} />;

            case 'all-onu':
            case 'search-onu':
            case 'onu-config':
            case 'delete-onu':
                // These can share the main ONU table for now, or have slightly different actions in a real app
                return <OnuTable data={MOCK_ONU_DATA} onRefresh={handleRefresh} searchTerm={searchTerm} />;

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <div className="text-4xl font-bold opacity-10 mb-4 tracking-tighter">HIOSO</div>
                        <p>View not implemented for: {selectedMenuId}</p>
                    </div>
                );
        }
    };

    return (
        <ThemeProvider defaultTheme="light" storageKey="hioso-theme">
            <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans antialiased">
                <TopHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                <div className="flex flex-grow overflow-hidden">
                    <Sidebar
                        menuItems={SIDEBAR_MENU}
                        selectedId={selectedMenuId}
                        onSelect={setSelectedMenuId}
                    />

                    <main className="flex-grow h-full overflow-hidden bg-muted/20">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};

export const Route = createFileRoute('/epon/')({
    component: Epon,
})
