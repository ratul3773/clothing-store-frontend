import type { Message } from '@/data/cms'

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export const statusTone = { new: 'blue', open: 'amber', resolved: 'green' } as const

export function filterMessages(list: Message[], tab: string, q: string) {
  const s = q.trim().toLowerCase()
  return list
    .filter((m) => (tab === 'all' || m.status === tab) && (!s || `${m.name} ${m.phone} ${m.email} ${m.subject} ${m.body}`.toLowerCase().includes(s)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
