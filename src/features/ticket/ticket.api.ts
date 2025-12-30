// src/features/customers/customers.api.ts
import { supabase } from '~/lib/supabase'
import type { LogKomplain, LogKomplainRow } from './ticket.types'

export async function listKomplain(
  params: { searchTerm?: string; limit?: number } = {},
) {
  const searchTerm = (params.searchTerm ?? '').trim()
  const limit = params.limit ?? 50

  let query = supabase
    .from('log_komplain')
    .select('*')
    .order('tiket', { ascending: false })

  if (!searchTerm) {
    const res = await query.limit(limit).returns<LogKomplainRow[]>()
    if (res.error) throw res.error

    return (res.data ?? []).map(mapRow)
  }

  const tokens = searchTerm.split(/\s+/).filter(Boolean)

  // Keep your existing OR-per-token behavior:
  for (const token of tokens) {
    query = query.or(
      `nama.ilike.%${token}%,user_pppoe.ilike.%${token}%,alamat.ilike.%${token}%,kendala.ilike.%${token}%`,
    )
  }

  const res = await query.returns<LogKomplainRow[]>()
  if (res.error) throw res.error

  return (res.data ?? []).map(mapRow)
}

function mapRow(row: LogKomplainRow): LogKomplain {

  const status = (
    ['open', 'proses', 'fwd teknis', 'closed', 'done', 'done / fwd teknis'].includes(
      row.status ?? '',
    )
      ? row.status
      : 'open'
  ) as LogKomplain['status']

  const tanggal = row.tanggal ?? ''
  const waktu = row.waktu ?? ''
  const createdAt = tanggal && waktu ? `${tanggal} ${waktu}` : tanggal

  return {
    ...row,
    ticketId: row.tiket ?? '',
    PIC: row.pic ?? '',
    nama: row.nama ?? '',
    kendala: row.kendala ?? '',
    status,
    tanggal,
    waktu,
    createdAt,
  }
}
