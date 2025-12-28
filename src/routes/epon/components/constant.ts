
import {
    OnuData,
    MenuItem,
    SystemInfo,
    PortData,
    StatisticData,
    VlanData,
    BandwidthData,
    MacConfigData,
    AggregationData,
    SnmpData,
    OnuCatvData,
    Customer
} from '~/@types/types';

export const MOCK_ONU_DATA: OnuData[] = [
    { id: '0/1:1', name: 'A.PUTRI', macAddress: '54:89:98:D3:86:6A', status: 'Up', fwVersion: '312e', chipId: '6301', ports: 8, rtt: 1101 },
    { id: '0/1:2', name: 'A.SAHLAN', macAddress: '80:FB:06:19:5E:61', status: 'Up', fwVersion: '312e', chipId: '6301', ports: 5, rtt: 1267 },
    { id: '0/1:3', name: 'ELA', macAddress: '54:89:98:6B:EA:BE', status: 'Up', fwVersion: '312e', chipId: '6301', ports: 87, rtt: 563 },
    { id: '0/3:1', name: 'P.HIRFAN', macAddress: '08:19:A6:39:3D:E5', status: 'Up', fwVersion: '312e', chipId: '6301', ports: 5, rtt: 124 },
    { id: '0/3:2', name: 'NA', macAddress: '50:0B:91:EB:2B:3F', status: 'Up', fwVersion: '0101', chipId: '9125', ports: 2, rtt: 192 },
    { id: '0/3:3', name: 'NA', macAddress: '50:0B:91:EB:2C:53', status: 'Up', fwVersion: '0101', chipId: '9125', ports: 2, rtt: 103 },
    { id: '0/3:5', name: 'A.ENDIN', macAddress: '54:89:98:69:02:36', status: 'Up', fwVersion: '312e', chipId: '6301', ports: 5, rtt: 166 },
    { id: '0/3:8', name: 'NA', macAddress: '50:0B:91:EB:2F:14', status: 'Up', fwVersion: '0101', chipId: '9125', ports: 2, rtt: 277 },
    { id: '0/4:2', name: 'KF', macAddress: '50:0B:91:EB:2E:96', status: 'Up', fwVersion: '0101', chipId: '9125', ports: 2, rtt: 53 },
    { id: '0/4:3', name: 'WARNET', macAddress: '50:0B:91:EB:2A:11', status: 'Up', fwVersion: '0101', chipId: '9125', ports: 2, rtt: 45 },
    { id: '0/5:1', name: 'OFFICE_MAIN', macAddress: 'CC:2D:E0:11:22:33', status: 'Down', fwVersion: '312e', chipId: '6301', ports: 4, rtt: 0 },
];

export const MOCK_SYSTEM_INFO: SystemInfo[] = [
    { attribute: 'Device Model', value: 'HIOSO-EPON-OLT-4T' },
    { attribute: 'Hardware Version', value: 'V1.0.3' },
    { attribute: 'Firmware Version', value: 'V2.4.05_190412' },
    { attribute: 'System MAC', value: '00:11:22:33:44:55' },
    { attribute: 'System Time', value: '2023-10-27 14:30:22' },
    { attribute: 'CPU Usage', value: '12%' },
    { attribute: 'Memory Usage', value: '34% (Total: 512MB)' },
    { attribute: 'System Uptime', value: '45 days, 12 hours, 30 minutes' },
];

export const MOCK_PORT_DATA: PortData[] = [
    { portId: 'GE1', type: 'Copper', speed: '1000M', status: 'Up', flowControl: 'Off', mtu: 1518 },
    { portId: 'GE2', type: 'Copper', speed: '1000M', status: 'Down', flowControl: 'Off', mtu: 1518 },
    { portId: 'GE3', type: 'Fiber', speed: '1000M', status: 'Up', flowControl: 'On', mtu: 1518 },
    { portId: 'GE4', type: 'Fiber', speed: '1000M', status: 'Up', flowControl: 'On', mtu: 1518 },
    { portId: 'PON1', type: 'EPON', speed: '1.25G', status: 'Up', flowControl: 'Off', mtu: 1518 },
    { portId: 'PON2', type: 'EPON', speed: '1.25G', status: 'Up', flowControl: 'Off', mtu: 1518 },
    { portId: 'PON3', type: 'EPON', speed: '1.25G', status: 'Up', flowControl: 'Off', mtu: 1518 },
    { portId: 'PON4', type: 'EPON', speed: '1.25G', status: 'Down', flowControl: 'Off', mtu: 1518 },
];

export const MOCK_STATISTIC_DATA: StatisticData[] = [
    { portId: 'GE1', txPackets: 154320, rxPackets: 123908, txBytes: '1.5 GB', rxBytes: '1.2 GB', errors: 0 },
    { portId: 'GE3', txPackets: 890012, rxPackets: 981231, txBytes: '8.4 GB', rxBytes: '9.1 GB', errors: 2 },
    { portId: 'PON1', txPackets: 4501239, rxPackets: 3219012, txBytes: '45.2 GB', rxBytes: '32.1 GB', errors: 15 },
    { portId: 'PON2', txPackets: 210934, rxPackets: 190823, txBytes: '2.1 GB', rxBytes: '1.9 GB', errors: 0 },
    { portId: 'PON3', txPackets: 567123, rxPackets: 543123, txBytes: '5.6 GB', rxBytes: '5.4 GB', errors: 5 },
];

export const MOCK_VLAN_DATA: VlanData[] = [
    { vlanId: 1, description: 'Default VLAN', type: 'Static', taggedPorts: '', untaggedPorts: 'GE1-4, PON1-4' },
    { vlanId: 100, description: 'Management', type: 'Static', taggedPorts: 'GE1, PON1', untaggedPorts: '' },
    { vlanId: 200, description: 'Internet Service', type: 'Static', taggedPorts: 'GE3, GE4, PON1-4', untaggedPorts: '' },
    { vlanId: 300, description: 'IPTV', type: 'Static', taggedPorts: 'GE3, PON1-4', untaggedPorts: '' },
    { vlanId: 400, description: 'VoIP', type: 'Static', taggedPorts: 'GE4, PON1-4', untaggedPorts: '' },
];

export const MOCK_BANDWIDTH_DATA: BandwidthData[] = [
    { onuId: '0/1:1', slaProfile: 'Profile-High', upstreamBw: '100M', downstreamBw: '500M' },
    { onuId: '0/1:2', slaProfile: 'Profile-Mid', upstreamBw: '50M', downstreamBw: '200M' },
    { onuId: '0/1:3', slaProfile: 'Profile-Low', upstreamBw: '20M', downstreamBw: '50M' },
    { onuId: '0/3:1', slaProfile: 'Profile-High', upstreamBw: '100M', downstreamBw: '1000M' },
];

export const MOCK_MAC_CONFIG: MacConfigData[] = [
    { macAddress: '00:11:22:33:44:55', vlanId: 1, portId: 'System', type: 'Static' },
    { macAddress: 'AA:BB:CC:DD:EE:FF', vlanId: 200, portId: 'PON1', type: 'Dynamic' },
    { macAddress: '12:34:56:78:90:AB', vlanId: 200, portId: 'PON1', type: 'Dynamic' },
];

export const MOCK_AGGREGATION_DATA: AggregationData[] = [
    { groupId: 1, policy: 'L2 (Src MAC + Dst MAC)', masterPort: 'GE3', memberPorts: ['GE3', 'GE4'] },
];

export const MOCK_SNMP_DATA: SnmpData[] = [
    { community: 'public', access: 'Read Only', viewName: 'ViewDefault', status: 'Enable' },
    { community: 'private', access: 'Read Write', viewName: 'ViewAll', status: 'Enable' },
];

export const MOCK_ONU_CATV_DATA: OnuCatvData[] = [
    { onuId: '0/1:1', state: 'On', inputPower: '-2.5 dBm', outputLevel: '80 dBuV' },
    { onuId: '0/1:2', state: 'On', inputPower: '-3.1 dBm', outputLevel: '78 dBuV' },
    { onuId: '0/1:3', state: 'Off', inputPower: 'N/A', outputLevel: 'N/A' },
];

export const MOCK_ATTEMPT_ONU_DATA: OnuData[] = [
    { id: '0/2:1', name: 'UNKNOWN', macAddress: 'AA:BB:CC:11:22:33', status: 'Down', fwVersion: 'N/A', chipId: 'N/A', ports: 0, rtt: 0 },
];

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 'CUST-001',
        name: 'A. Putri',
        address: '123 Jalan Mawar, Jakarta',
        phone: '+62 812-3456-7890',
        email: 'putri@example.com',
        plan: 'Fiber 100M',
        onuId: '0/1:1',
        status: 'Active',
        balance: 'IDR 0',
        joinedDate: '2023-01-15'
    },
    {
        id: 'CUST-002',
        name: 'A. Sahlan',
        address: '456 Jalan Melati, Bandung',
        phone: '+62 813-4567-8901',
        email: 'sahlan@example.com',
        plan: 'Fiber 50M',
        onuId: '0/1:2',
        status: 'Active',
        balance: 'IDR 150.000',
        joinedDate: '2023-02-20'
    },
    {
        id: 'CUST-003',
        name: 'Ela',
        address: '789 Jalan Anggrek, Surabaya',
        phone: '+62 811-5678-9012',
        email: 'ela@example.com',
        plan: 'Fiber 1G',
        onuId: '0/1:3',
        status: 'Suspended',
        balance: 'IDR 500.000',
        joinedDate: '2022-11-05'
    },
    {
        id: 'CUST-004',
        name: 'P. Hirfan',
        address: '101 Jalan Kenanga, Medan',
        phone: '+62 815-6789-0123',
        email: 'hirfan@example.com',
        plan: 'Fiber 50M',
        onuId: '0/3:1',
        status: 'Active',
        balance: 'IDR 0',
        joinedDate: '2023-10-01'
    },
    {
        id: 'CUST-005',
        name: 'A. Endin',
        address: '202 Jalan Flamboyan, Bali',
        phone: '+62 818-7890-1234',
        email: 'endin@example.com',
        plan: 'Fiber 20M',
        onuId: '0/3:5',
        status: 'Pending',
        balance: 'IDR 0',
        joinedDate: '2023-11-12'
    }
];

export const SIDEBAR_MENU: MenuItem[] = [
    { id: 'system', label: 'System' },
    { id: 'customers', label: 'Customers' },
    {
        id: 'onu-management',
        label: 'ONU Management',
        isOpen: true,
        children: [
            { id: 'onu-config', label: 'ONU Config' },
            { id: 'delete-onu', label: 'Delete ONU' },
            { id: 'search-onu', label: 'Search ONU' },
            { id: 'authed-onu', label: 'Authed Onu' },
            { id: 'attempt-onu', label: 'Attempt Onu' },
            { id: 'onu-catv', label: 'ONU CATV' },
            { id: 'all-onu', label: 'All ONU' }, // Selected by default
        ],
    },
    { id: 'port-management', label: 'Port Management' },
    { id: 'statistic', label: 'Statistic' },
    { id: 'vlan-config', label: 'Vlan Config' },
    { id: 'bandwidth-config', label: 'Bandwidth Config' },
    { id: 'olt-mac-config', label: 'OLT Mac Config' },
    { id: 'port-aggregation', label: 'Port Aggregation' },
    { id: 'snmp-config', label: 'SNMP Config' },
];
