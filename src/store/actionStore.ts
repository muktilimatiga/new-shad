import { create } from 'zustand'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCheckOnu, useRebootOnu } from '~/services/useApi'
import { useLogActivity } from '~/features/activity-log/activity.hooks'
import type { OnuDetailRequest } from '~/services/generated/model'

// ============================================
// TYPES
// ============================================

export type ActionMode =
  | 'cek'
  | 'cek-redaman'
  | 'reboot'
  | 'no-onu'
  | 'cek-detail-port'
  | 'cek-redaman-1-port'

export interface ActionItem {
  id: string
  mode: ActionMode
  oltName: string
  interface: string
  onuSn?: string
  status: 'pending' | 'running' | 'success' | 'error'
  result?: any
  error?: string
}

// ============================================
// ZUSTAND STORE (State Only)
// ============================================

interface ActionStoreState {
  actionQueue: ActionItem[]
  selectedOlt: string
  selectedInterface: string

  // Actions
  setSelectedOlt: (olt: string) => void
  setSelectedInterface: (iface: string) => void
  addToQueue: (item: Omit<ActionItem, 'id' | 'status'>) => void
  removeFromQueue: (id: string) => void
  updateItemStatus: (
    id: string,
    status: ActionItem['status'],
    result?: any,
    error?: string,
  ) => void
  clearQueue: () => void
  reset: () => void
}

export const useActionStore = create<ActionStoreState>((set) => ({
  actionQueue: [],
  selectedOlt: '',
  selectedInterface: '',

  setSelectedOlt: (olt) => set({ selectedOlt: olt }),
  setSelectedInterface: (iface) => set({ selectedInterface: iface }),

  addToQueue: (item) =>
    set((state) => ({
      actionQueue: [
        ...state.actionQueue,
        { ...item, id: crypto.randomUUID(), status: 'pending' },
      ],
    })),

  removeFromQueue: (id) =>
    set((state) => ({
      actionQueue: state.actionQueue.filter((item) => item.id !== id),
    })),

  updateItemStatus: (id, status, result, error) =>
    set((state) => ({
      actionQueue: state.actionQueue.map((item) =>
        item.id === id ? { ...item, status, result, error } : item,
      ),
    })),

  clearQueue: () => set({ actionQueue: [] }),

  reset: () =>
    set({
      actionQueue: [],
      selectedOlt: '',
      selectedInterface: '',
    }),
}))

// ============================================
// ACTION HOOK (Uses React Hooks + Mutations)
// ============================================

export const useActionExecutor = () => {
  const queryClient = useQueryClient()
  const { mutate: logActivity } = useLogActivity()

  // Mutations
  const cekMutation = useCheckOnu()
  const rebootMutation = useRebootOnu()

  // Store actions
  const { updateItemStatus } = useActionStore()

  return useMemo(
    () => ({
      // Execute CEK ONU action
      executeCek: async (oltName: string, data: OnuDetailRequest) => {
        logActivity({
          action: 'ONU_CHECK_STARTED',
          target: oltName,
          status: 'SUCCESS',
          details: JSON.stringify({
            interface: data.interface,
            olt_name: data.olt_name,
          }),
        })

        try {
          const result = await cekMutation.mutateAsync({ oltName, data })

          logActivity({
            action: 'ONU_CHECK_SUCCESS',
            target: oltName,
            status: 'SUCCESS',
            details: JSON.stringify(result),
          })

          return result
        } catch (error: any) {
          logActivity({
            action: 'ONU_CHECK_FAILED',
            target: oltName,
            status: 'ERROR',
            details: error.message || 'Unknown error',
          })
          throw error
        }
      },

      // Execute REBOOT ONU action
      executeReboot: async (oltName: string, params: { interface: string }) => {
        logActivity({
          action: 'ONU_REBOOT_STARTED',
          target: oltName,
          status: 'SUCCESS',
          details: JSON.stringify(params),
        })

        try {
          const result = await rebootMutation.mutateAsync({ oltName, params })

          logActivity({
            action: 'ONU_REBOOT_SUCCESS',
            target: oltName,
            status: 'SUCCESS',
            details: JSON.stringify(result),
          })

          await queryClient.invalidateQueries({ queryKey: ['no-onu'] })
          return result
        } catch (error: any) {
          logActivity({
            action: 'ONU_REBOOT_FAILED',
            target: oltName,
            status: 'ERROR',
            details: error.message || 'Unknown error',
          })
          throw error
        }
      },

      // Execute batch queue
      executeQueue: async (queue: ActionItem[]) => {
        for (const item of queue) {
          updateItemStatus(item.id, 'running')

          try {
            let result

            switch (item.mode) {
              case 'cek':
              case 'cek-redaman':
              case 'cek-detail-port':
                result = await cekMutation.mutateAsync({
                  oltName: item.oltName,
                  data: {
                    interface: item.interface,
                    olt_name: item.oltName || '',
                  },
                })
                break

              case 'reboot':
                result = await rebootMutation.mutateAsync({
                  oltName: item.oltName,
                  params: { interface: item.interface },
                })
                break

              default:
                throw new Error(`Unknown action mode: ${item.mode}`)
            }

            updateItemStatus(item.id, 'success', result)

            logActivity({
              action: `ACTION_${item.mode.toUpperCase()}_SUCCESS`,
              target: item.oltName,
              status: 'SUCCESS',
              details: JSON.stringify({
                interface: item.interface,
                olt_name: item.oltName,
              }),
            })
          } catch (error: any) {
            updateItemStatus(item.id, 'error', undefined, error.message)

            logActivity({
              action: `ACTION_${item.mode.toUpperCase()}_FAILED`,
              target: item.oltName,
              status: 'ERROR',
              details: error.message,
            })
          }
        }
      },

      // Mutation states for UI
      isCekLoading: cekMutation.isPending,
      isRebootLoading: rebootMutation.isPending,
    }),
    [cekMutation, rebootMutation, logActivity, queryClient, updateItemStatus],
  )
}
