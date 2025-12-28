
export interface OnuData {
    id: string;
    name: string;
    macAddress: string;
    status: 'Up' | 'Down';
    fwVersion: string;
    chipId: string;
    ports: number;
    rtt: number;
}

export interface MenuItem {
    label: string;
    id: string;
    children?: MenuItem[];
    isOpen?: boolean;
}

export interface SystemInfo {
    attribute: string;
    value: string;
}

export interface PortData {
    portId: string;
    type: string;
    speed: string;
    status: 'Up' | 'Down';
    flowControl: string;
    mtu: number;
}

export interface StatisticData {
    portId: string;
    txPackets: number;
    rxPackets: number;
    txBytes: string;
    rxBytes: string;
    errors: number;
}

export interface VlanData {
    vlanId: number;
    description: string;
    type: 'Static' | 'Dynamic';
    taggedPorts: string;
    untaggedPorts: string;
}

export interface BandwidthData {
    onuId: string;
    slaProfile: string;
    upstreamBw: string;
    downstreamBw: string;
}

export interface MacConfigData {
    macAddress: string;
    vlanId: number;
    portId: string;
    type: 'Static' | 'Dynamic' | 'Blackhole';
}

export interface AggregationData {
    groupId: number;
    policy: string;
    masterPort: string;
    memberPorts: string[];
}

export interface SnmpData {
    community: string;
    access: 'Read Only' | 'Read Write';
    viewName: string;
    status: 'Enable' | 'Disable';
}

export interface OnuCatvData {
    onuId: string;
    state: 'On' | 'Off';
    inputPower: string;
    outputLevel: string;
}

export interface Customer {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    plan: string;
    onuId: string;
    status: 'Active' | 'Suspended' | 'Pending';
    balance: string;
    joinedDate: string;
}
