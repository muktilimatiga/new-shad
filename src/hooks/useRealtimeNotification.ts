// src/hooks/useRealtimeNotifications.ts
import { useEffect } from 'react'
import { supabase } from '~/lib/supabase'
import { useAppStore } from '~/hooks/store'
import { toast } from 'sonner'

export const useRealtimeNotifications = () => {
  const { addNotification } = useAppStore()

  useEffect(() => {
    const ticketChannel = supabase
      .channel('realtime-tickets')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'log_komplain' },
        (payload) => {
          const newTicket = payload.new as any

          // A. Add to Dropdown History
          addNotification({
            title: 'New Ticket Created',
            message: `${newTicket.name} reported: ${newTicket.description?.substring(0, 30)}...`,
            type: 'info',
            link: `/log-komplain/${newTicket.id}`, // Navigate here when clicked
          })

          // B. Show Immediate Toast (Optional)
          toast.info(`New Ticket: ${newTicket.name}`)
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'log_komplain' },
        (payload) => {
          const updatedTicket = payload.new as any

          // Only notify on status changes
          if (updatedTicket.status !== (payload.old as any).status) {
            addNotification({
              title: 'Ticket Updated',
              message: `Ticket #${updatedTicket.id} status changed to ${updatedTicket.status}`,
              type: 'warning',
              link: `/log-komplain/${updatedTicket.id}`,
            })
          }
        },
      )
      .subscribe()

    // 2. Subscribe to 'log_activity' (System Alerts)
    const logChannel = supabase
      .channel('realtime-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'log_activity' },
        (payload) => {
          const log = payload.new as any

          // Status is stored as boolean in DB (true = success, false = error)
          const isError = log.status === false || log.status === 'ERROR'

          if (isError) {
            addNotification({
              title: 'Action Failed',
              message: `${log.action} on ${log.target} failed`,
              type: 'error',
              link: '/logs',
            })
            toast.error(`Failed: ${log.action}`)
          } else if (
            log.action?.includes('CONFIG') ||
            log.action?.includes('TICKET')
          ) {
            // Notify for important success actions
            addNotification({
              title: log.action?.replace('_', ' ') || 'Activity',
              message: `${log.target}`,
              type: log.action?.includes('SUCCESS') ? 'success' : 'info',
              link: '/logs',
            })
          }
        },
      )
      .subscribe()

    // Cleanup
    return () => {
      supabase.removeChannel(ticketChannel)
      supabase.removeChannel(logChannel)
    }
  }, [addNotification])
}
