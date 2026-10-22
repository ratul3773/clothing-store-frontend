import type { Source, Status } from '@/data/orders'
import type { OrderFilters } from '@/app/(admin)/admin/orders/_types/orders.types'

export const SOURCE_LABEL: Record<Source, string> = {
  WEBSITE: 'Website', ADMIN_MANUAL: 'Admin (manual)', WHATSAPP: 'WhatsApp', FACEBOOK: 'Facebook', INSTAGRAM: 'Instagram', PHONE: 'Phone',
}
export const MANUAL_SOURCES: Source[] = ['ADMIN_MANUAL', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'PHONE']
export const COURIERS = ['Pathao', 'Steadfast'] as const
export const PAYMENTS = ['COD', 'SSLCOMMERZ'] as const
export const EXTRA_STATUSES: Status[] = ['CANCELLED', 'RETURNED']
export const MANUAL_STATUSES: Status[] = ['PENDING_CONFIRMATION', 'CONFIRMED', 'PROCESSING']
export const EMPTY_FILTERS: OrderFilters = { q: '', status: '', source: '', payment: '', courier: '', from: '', to: '' }
export const PAGE_SIZE = 10
