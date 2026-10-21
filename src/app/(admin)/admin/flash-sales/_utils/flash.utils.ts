import { isFlashLive, type FlashSale } from '@/data/site'

export type FlashStatus = 'Live' | 'Scheduled' | 'Ended' | 'Disabled'

export function flashStatus(f: FlashSale, now = Date.now()): FlashStatus {
  if (!f.enabled) return 'Disabled'
  if (isFlashLive(f, now)) return 'Live'
  return +new Date(f.startsAt) > now ? 'Scheduled' : 'Ended'
}

export const statusTone = { Live: 'green', Scheduled: 'blue', Ended: 'gray', Disabled: 'amber' } as const

export function countdown(f: FlashSale, now = Date.now()): string {
  const s = flashStatus(f, now)
  if (s === 'Disabled') return '-'
  if (s === 'Ended') return 'Ended'
  const target = s === 'Live' ? +new Date(f.endsAt) : +new Date(f.startsAt)
  const ms = Math.max(0, target - now)
  const d = Math.floor(ms / 864e5)
  const h = Math.floor((ms % 864e5) / 36e5)
  const m = Math.floor((ms % 36e5) / 6e4)
  const t = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`
  return s === 'Live' ? `Ends in ${t}` : `Starts in ${t}`
}

const pad = (n: number) => String(n).padStart(2, '0')
export function toLocalInput(iso: string): string {
  const d = new Date(iso)
  if (isNaN(+d)) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
export const fromLocalInput = (v: string) => new Date(v).toISOString()
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export type FlashDraft = { title: string; subtitle: string; discountPct: string; enabled: boolean; startsAt: string; endsAt: string; productIds: string[] }
export type FlashErrors = Partial<Record<'title' | 'discountPct' | 'startsAt' | 'endsAt' | 'productIds', string>>

export function validateFlash(d: FlashDraft): FlashErrors {
  const e: FlashErrors = {}
  if (!d.title.trim()) e.title = 'Title is required'
  const pct = Number(d.discountPct)
  if (!d.discountPct || isNaN(pct) || pct <= 0 || pct > 90) e.discountPct = 'Enter a discount between 1 and 90'
  if (!d.startsAt) e.startsAt = 'Start is required'
  if (!d.endsAt) e.endsAt = 'End is required'
  if (d.startsAt && d.endsAt && +new Date(d.endsAt) <= +new Date(d.startsAt)) e.endsAt = 'End must be after start'
  if (d.productIds.length === 0) e.productIds = 'Select at least one product'
  return e
}

/** Other campaigns that overlap the draft window and share products: returns map productId -> campaign titles. */
export function findConflicts(d: FlashDraft, others: FlashSale[]): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  if (!d.startsAt || !d.endsAt) return out
  const s = +new Date(d.startsAt)
  const e = +new Date(d.endsAt)
  for (const o of others) {
    if (+new Date(o.startsAt) < e && +new Date(o.endsAt) > s) {
      for (const id of o.productIds) if (d.productIds.includes(id)) (out[id] ??= []).push(o.title)
    }
  }
  return out
}
