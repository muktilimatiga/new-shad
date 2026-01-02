import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query' // 1. Import this
import type { TicketFormData } from './ticketStore'
import {
  useCreateAndProcessTicketApiV1TicketCreateAndProcessPost,
  useCloseTicketApiV1TicketClosePost,
  useForwardTicketApiV1TicketForwardPost,
  useProcessTicketOnlyApiV1TicketProcessPost,
} from '~/services/generated/'

import {
  CreateTicketFormFields,
  CreateTicketFormSchema,
  OpenTicketFormFields,
  OpenTicketFormSchema,
  ForwardTicketFormFields,
  ForwardTicketFormSchema,
  CloseTicketFormFields,
  CloseTicketFormSchema,
} from '~/components/form/TicketFormField'

import { useAppStore } from '~/hooks/store'
import { useLogActivity } from '~/features/activity-log/activity.hooks'

export type TicketMode = 'create' | 'open' | 'forward' | 'close'

// 2. HELPER: Safe Enum Mapper
// This guarantees we never send "Low" when the API wants "LOW"
const safePriority = (val?: string) => {
  const v = val?.toUpperCase() || 'LOW'
  return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(v) ? v : 'LOW'
}

const safeType = (val?: string) => {
  const v = val?.toUpperCase() || 'FREE'
  return ['FREE', 'CHARGED'].includes(v) ? v : 'FREE'
}

export const useTicketForm = (mode: TicketMode) => {
  // 3. Get QueryClient to refresh data
  const queryClient = useQueryClient()

  // API Hooks
  const createMutation =
    useCreateAndProcessTicketApiV1TicketCreateAndProcessPost()
  const openMutation = useProcessTicketOnlyApiV1TicketProcessPost()
  const forwardMutation = useForwardTicketApiV1TicketForwardPost()
  const closeMutation = useCloseTicketApiV1TicketClosePost()

  const user = useAppStore((state) => state.user)

  // Activity logging
  const { mutate: logActivity } = useLogActivity()

  // 4. Shared "On Success" logic
  // This ensures that NO MATTER which action you take, the ticket list refreshes
  const handleSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tickets'] })
  }

  return useMemo(() => {
    const commonProps = {
      noc_username: user?.username || '',
      noc_password: user?.password || '',
    }

    switch (mode) {
      case 'open':
        return {
          title: 'Process Ticket',
          FormFields: OpenTicketFormFields,
          schema: OpenTicketFormSchema,
          mutation: openMutation,
          submitLabel: 'Process Ticket',
          variant: 'default' as const,
          execute: async (data: TicketFormData) => {
            const target = data.user_pppoe || data.name || ''
            const action = data.action_ticket || 'cek'

            // Combine them (or just use target if your backend expects that)
            const finalQuery = `${action} ${target}`.trim()

            const res = await openMutation.mutateAsync({
              data: {
                query: finalQuery,
                ...commonProps,
              },
            })

            // Log ticket opened
            logActivity({
              action: 'TICKET_OPENED',
              target: data.name || data.user_pppoe || 'Unknown',
              status: 'SUCCESS',
              details: JSON.stringify({
                action: action,
                ticketRef: data.ticketRef,
              }),
            })

            await handleSuccess()
            return res
          },
        }

      case 'forward':
        return {
          title: 'Forward Ticket',
          FormFields: ForwardTicketFormFields,
          schema: ForwardTicketFormSchema,
          mutation: forwardMutation,
          submitLabel: 'Forward Ticket',
          variant: 'default' as const,
          execute: async (data: TicketFormData) => {
            const iface = data.interface?.trim()
            const onuIndex = iface ? `gpon-onu_${iface}` : ''

            const res = await forwardMutation.mutateAsync({
              data: {
                query: data.ticketRef || '',
                service_impact: data.service_impact || '-',
                root_cause: data.root_cause || '-',
                network_impact: data.network_impact || '-',
                recomended_action: data.recomended_action || '-',
                onu_index: onuIndex,
                sn_modem: data.onu_sn || '',
                priority: safePriority(data.priority) as any,
                person_in_charge: data.person_in_charge || 'ALL TECHNICIAN',
                ...commonProps,
              },
            })

            // Log ticket forwarded
            logActivity({
              action: 'TICKET_FORWARDED',
              target: data.name || data.user_pppoe || 'Unknown',
              status: 'SUCCESS',
              details: JSON.stringify({
                ticketRef: data.ticketRef,
                priority: data.priority,
                pic: data.person_in_charge,
              }),
            })

            await handleSuccess()
            return res
          },
        }

      case 'close':
        return {
          title: 'Close Ticket',
          FormFields: CloseTicketFormFields,
          schema: CloseTicketFormSchema,
          mutation: closeMutation,
          submitLabel: 'Close Ticket',
          variant: 'destructive' as const,
          execute: async (data: TicketFormData) => {
            const res = await closeMutation.mutateAsync({
              data: {
                query: data.ticketRef || '',
                close_reason: data.action_close || 'Ticket Closed by System',
                onu_sn: data.onu_sn || '',
                ...commonProps,
              },
            })

            // Log ticket closed
            logActivity({
              action: 'TICKET_CLOSED',
              target: data.name || data.user_pppoe || 'Unknown',
              status: 'SUCCESS',
              details: JSON.stringify({
                ticketRef: data.ticketRef,
                reason: data.action_close,
              }),
            })

            await handleSuccess()
            return res
          },
        }

      case 'create':
      default:
        return {
          title: 'Create New Ticket',
          FormFields: CreateTicketFormFields,
          schema: CreateTicketFormSchema,
          mutation: createMutation,
          submitLabel: 'Create Ticket',
          variant: 'default' as const,
          execute: async (data: TicketFormData) => {
            const res = await createMutation.mutateAsync({
              data: {
                query: data.user_pppoe || data.name || '',
                description: data.description || 'No description provided',
                // USE SAFE MAPPERS
                priority: safePriority(data.priority) as any,
                jenis: safeType(data.type) as any,
                ...commonProps,
              },
            })

            // Log ticket created
            logActivity({
              action: 'TICKET_CREATED',
              target: data.name || data.user_pppoe || 'Unknown',
              status: 'SUCCESS',
              details: JSON.stringify({
                description: data.description,
                priority: data.priority,
              }),
            })

            await handleSuccess()
            return res
          },
        }
    }
  }, [
    mode,
    createMutation,
    openMutation,
    forwardMutation,
    closeMutation,
    user,
    queryClient, // Add to dependencies
  ])
}
