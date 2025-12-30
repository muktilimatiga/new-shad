// @ts-nocheck
import React from 'react';
import { z } from 'zod';
import {
  User, DownloadCloud, Settings, Unlock, Fingerprint,
  Scan, Router, Loader2, Database, Search, RefreshCw
} from 'lucide-react';
import { FieldWrapper } from '@/components/form/FieldWrapper';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Schemas
export const BaseConfigSchema = z.object({
  olt_name: z.string().min(1, "OLT is required"),
  modem_type: z.string().min(1, "Modem Type is required"),
  onu_sn: z.string().min(1, "Serial Number is required"),
  eth_locks: z.boolean().default(true),
});

export const ConfigManualSchema = BaseConfigSchema.extend({
  package: z.string().min(1, "Package is required"),
  name: z.string().min(1, "Customer Name is required"),
  address: z.string().optional(),
  user_pppoe: z.string().min(1, "PPPoE User is required"),
  pass_pppoe: z.string().min(1, "PPPoE Password is required"),
  fiber_source_id: z.string().optional(),
});

export const ConfigAutoSchema = BaseConfigSchema.extend({
  data_psb: z.string().min(1, "Please select a pending customer"),
  name: z.string().optional(),
  package: z.string().optional(),
});

export const ConfigBatchSchema = BaseConfigSchema.pick({
  olt_name: true,
  modem_type: true,
}).extend({
  package: z.string().min(1, "Package is required"),
});

// Constants
export const MODEM_ITEMS = ["C-DATA", "F609", "F670L"];
export const PACKAGE_ITEMS = ["10M", "15M", "20M", "25M", "30M", "35M", "40M", "50M", "75M", "100M"];
export const OLT_ITEMS = ["BOYOLANGU", "GANDUSARI", "KAUMAN", "BEJI", "DURENAN", "KALIDAWIR", "BLITAR", "CAMPUR BARU"];

// Props
interface FormFieldProps {
  mode: 'manual' | 'auto' | 'batch' | 'bridge';
  oltOptions?: string[];
  detectedOnts?: any[];
  onScan?: () => void;
  isScanning?: boolean;
  psbList?: any[];
  fetchPsbData?: () => void;
  isFetchingPSB?: boolean;
  selectPSBList?: (value: string) => void;
  selectUser?: (value: any) => void;
  customerList?: any[];
  customerSearchTerm?: string;
  setCustomerSearchTerm?: (value: string) => void;
  onCustomerSearch?: () => void;
  isSearchingCustomer?: boolean;
}

// Source Selection Section
const SourceSelectionSection = (props: Partial<FormFieldProps>) => {
  const { mode } = props;

  if (mode === 'auto') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <DownloadCloud className="h-4 w-4 text-primary" />
          Pending Registration
        </h3>
        <div className="flex items-center gap-2">
          <FieldWrapper
            name="data_psb"
            component="Select"
            items={props.psbList?.map(p => ({ value: p.id, label: `${p.name} - ${p.address}` })) || []}
            placeholder={props.psbList?.length === 0 ? "No pending data" : "Select customer..."}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={props.fetchPsbData}
            disabled={props.isFetchingPSB}
          >
            <RefreshCw className={`h-4 w-4 ${props.isFetchingPSB ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Database className="h-4 w-4 text-primary" />
          Customer Search
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, ID or address..."
            className="pl-9 pr-10"
            value={props.customerSearchTerm}
            onChange={e => props.setCustomerSearchTerm?.(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && props.onCustomerSearch?.()}
          />
          {props.isSearchingCustomer && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}

          {/* Search Results Dropdown */}
          {props.customerSearchTerm && (props.customerList?.length || 0) > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
              {props.customerList?.map((u, idx) => (
                <div
                  key={u.customer_id || u.user_pppoe || idx}
                  className="flex items-center gap-3 p-2 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    props.selectUser?.(u);
                    props.setCustomerSearchTerm?.('');
                  }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {(u.nama || '?').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.nama || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.alamat || u.user_pppoe || 'No address'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// Device Configuration Section
const DeviceConfigSection = ({ detectedOnts = [], onScan, isScanning }: Partial<FormFieldProps>) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
      <Router className="h-4 w-4 text-primary" />
      Device Configuration
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Modem Type</Label>
        <FieldWrapper
          name="modem_type"
          component="Select"
          items={MODEM_ITEMS.map(opt => ({ value: opt, label: opt }))}
          placeholder="Select modem"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Serial Number</Label>
        <div className="flex gap-2">
          <FieldWrapper
            name="onu_sn"
            component="Select"
            items={detectedOnts.map(ont => ({ value: ont.sn, label: `${ont.sn}` }))}
            placeholder={detectedOnts.length > 0 ? "Select device" : "Scan first"}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onScan}
            disabled={isScanning}
          >
            {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Customer Data Section
const CustomerDataSection = () => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
      <User className="h-4 w-4 text-primary" />
      Customer Information
    </h3>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Full Name</Label>
          <FieldWrapper name="name" component="Input" placeholder="Customer name" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Package</Label>
          <FieldWrapper
            name="package"
            component="Select"
            items={PACKAGE_ITEMS.map(opt => ({ value: opt, label: opt }))}
            placeholder="Select package"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Address</Label>
        <FieldWrapper name="address" component="Textarea" placeholder="Full address" className="min-h-[60px] resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">PPPoE Username</Label>
          <FieldWrapper name="user_pppoe" component="Input" placeholder="Username" className="font-mono text-sm" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">PPPoE Password</Label>
          <FieldWrapper name="pass_pppoe" component="Input" placeholder="Password" className="font-mono text-sm" />
        </div>
      </div>
    </div>
  </div>
);

// Batch Form Layout
const BatchFormLayout = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Target OLT</Label>
      <FieldWrapper
        name="olt_name"
        component="Select"
        items={OLT_ITEMS.map(opt => ({ value: opt, label: opt }))}
        placeholder="Select OLT"
      />
    </div>

    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
        <Settings className="h-4 w-4 text-primary" />
        Batch Configuration
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Modem Model</Label>
          <FieldWrapper
            name="modem_type"
            component="Select"
            items={MODEM_ITEMS.map(opt => ({ value: opt, label: opt }))}
            placeholder="Select model"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Package</Label>
          <FieldWrapper
            name="package"
            component="Select"
            items={PACKAGE_ITEMS.map(opt => ({ value: opt, label: opt }))}
            placeholder="Select package"
          />
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export const ConfigFormFields = (props: FormFieldProps) => {
  const { mode } = props;

  if (mode === 'batch') {
    return <BatchFormLayout />;
  }

  return (
    <div className="space-y-6">
      {/* Target OLT */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Target OLT</Label>
        <FieldWrapper
          name="olt_name"
          component="Select"
          items={OLT_ITEMS.map(opt => ({ value: opt, label: opt }))}
          placeholder="Select OLT"
        />
      </div>

      {/* Source Selection */}
      <SourceSelectionSection {...props} />

      {/* Device Configuration */}
      <DeviceConfigSection {...props} />

      {/* Customer Information */}
      <CustomerDataSection />

      {/* Port Security */}
      <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
        <div className="flex items-center gap-3">
          <Unlock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Port Security</p>
            <p className="text-xs text-muted-foreground">Lock unused ethernet ports</p>
          </div>
        </div>
        <FieldWrapper name="eth_locks" component="Checkbox" />
      </div>
    </div>
  );
};