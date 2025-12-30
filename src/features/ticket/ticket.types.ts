// src/features/customers/customers.types.ts
import type { Tables } from '~/database.types'

export type LogKomplainRow = Tables<'log_komplain'>

// If you want a UI type with computed fields:
export type LogKomplain = LogKomplainRow & {
  createdAt: string
  ticketId: string
  PIC: string
  status: 'open' | 'proses' | 'fwd teknis' | 'closed' | 'done'
  nama: string
  kendala: string
}
