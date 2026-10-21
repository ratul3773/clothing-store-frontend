import { settings } from '@/data/site'
import type { Payment } from '@/app/(store)/checkout/_types/checkout.types'

/** Payment methods currently switched on in CMS settings (COD is the fallback when nothing is enabled). */
export function enabledPayments(): Payment[] {
  const list: Payment[] = []
  if (settings.payments.cod) list.push('COD')
  if (settings.payments.online) list.push('SSLCOMMERZ')
  return list.length ? list : ['COD']
}
