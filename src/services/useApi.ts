import { useMutation, keepPreviousData } from '@tanstack/react-query'
import type {
  ConfigurationRequest,
  OnuDetailRequest
} from '~/services/generated/model'

import {
  useGetFastCustomerDetailsApiV1CustomerInvoicesGet,
  useGetPsbDataApiV1CustomerPsbGet
} from '~/services/generated/customer/customer'

import {
  detectUncfgOntsApiV1ConfigApiOltsOltNameDetectOntsGet,
  runConfigurationApiV1ConfigApiOltsOltNameConfigurePost,
  useGetOptionsApiV1ConfigApiOptionsGet
} from '~/services/generated/config/config'

// Re-export types
export type {  ConfigurationRequest, OnuDetailRequest }

// 1. SEARCH HOOK
export const useCustomerInvoices = (query: string) => {
  return useGetFastCustomerDetailsApiV1CustomerInvoicesGet(
    { query },
    {
      // FIX: Cast to 'any' to bypass the missing 'queryKey' error.
      // The generated hook provides the key internally.
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
       refetchOnWindowFocus: false
    } as any // FIX: Cast to any
  });
};

// 3. PSB DATA HOOK
export const usePsbData = () => {
  return useGetPsbDataApiV1CustomerPsbGet({
    query: { 
        staleTime: Infinity, 
        enabled: false
    } as any, // FIX: Cast to any
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
    mutationFn: ({ oltName, data }: { oltName: string; data: ConfigurationRequest }) => 
      runConfigurationApiV1ConfigApiOltsOltNameConfigurePost(oltName, data),
  })
}