import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import type {
  ConfigurationRequest,
  OnuDetailRequest,
  ConfigurationResponse,
  RebootOnuApiV1OnuOltNameOnuRebootGetParams,
  NoOnuApiV1OnuOltNameOnuNoOnuGetParams,
} from '~/services/generated/model'

import {
  useGetFastCustomerDetailsApiV1CustomerInvoicesGet,
  useGetPsbDataApiV1CustomerPsbGet,
} from '~/services/generated/customer/customer'

import {
  detectUncfgOntsApiV1ConfigApiOltsOltNameDetectOntsGet,
  runConfigurationApiV1ConfigApiOltsOltNameConfigurePost,
  useGetOptionsApiV1ConfigApiOptionsGet,
} from '~/services/generated/config/config'

// --- NEW IMPORTS (Using Raw Fetchers for better control) ---
import {
  cekOnuApiV1OnuOltNameOnuCekPost, // Raw Cek Function
  rebootOnuApiV1OnuOltNameOnuRebootGet, // Raw Reboot Function
  noOnuApiV1OnuOltNameOnuNoOnuGet, // Raw No Onu Function
} from '~/services/generated/onu/onu'

// Re-export types
export type { ConfigurationRequest, OnuDetailRequest, ConfigurationResponse }

// 1. SEARCH HOOK
export const useCustomerInvoices = (query: string) => {
  return useGetFastCustomerDetailsApiV1CustomerInvoicesGet(
    { query },
    {
      query: {
        enabled: !!query && query.length >= 3,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        retry: 1,
      } as any,
    },
  )
}

// 2. DYNAMIC OPTIONS HOOK
export const useConfigOptions = () => {
  return useGetOptionsApiV1ConfigApiOptionsGet({
    query: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    } as any,
  })
}

// 3. PSB DATA HOOK
export const usePsbData = () => {
  return useGetPsbDataApiV1CustomerPsbGet({
    query: {
      staleTime: Infinity,
      enabled: false,
    } as any,
  })
}

// 4. SCAN ACTION
export const useScanOnts = () => {
  return useMutation({
    mutationFn: (oltName: string) =>
      detectUncfgOntsApiV1ConfigApiOltsOltNameDetectOntsGet(oltName),
  })
}

// 5. CONFIGURE ACTION
export const useRunConfiguration = () => {
  return useMutation({
    mutationFn: ({
      oltName,
      data,
    }: {
      oltName: string
      data: ConfigurationRequest
    }) => runConfigurationApiV1ConfigApiOltsOltNameConfigurePost(oltName, data),
  })
}

// --- NEW HOOKS ADDED BELOW ---

// 6. CHECK ONU (Mutation)
// Usage: mutation.mutate({ oltName, data: { ... } })
export const useCheckOnu = () => {
  return useMutation({
    mutationFn: ({
      oltName,
      data,
    }: {
      oltName: string
      data: OnuDetailRequest
    }) => cekOnuApiV1OnuOltNameOnuCekPost(oltName, data),
  })
}

// 7. REBOOT ONU (Mutation)
// We wrap the GET request in useMutation so it only runs when you click a button.
export const useRebootOnu = () => {
  return useMutation({
    mutationFn: ({
      oltName,
      params,
    }: {
      oltName: string
      params: RebootOnuApiV1OnuOltNameOnuRebootGetParams
    }) => rebootOnuApiV1OnuOltNameOnuRebootGet(oltName, params),
  })
}

// 8. NO ONU LIST (Query)
// This fetches the list of "No ONUs".
// Pass enabled: true/false in options if you want to control when it runs.
export const useNoOnuList = (
  oltName: string,
  params: NoOnuApiV1OnuOltNameOnuNoOnuGetParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['no-onu', oltName, params],
    queryFn: () => noOnuApiV1OnuOltNameOnuNoOnuGet(oltName, params),
    enabled: !!oltName && enabled, // Only run if OLT name exists
    staleTime: 1000 * 30, // Cache for 30 seconds
  })
}
