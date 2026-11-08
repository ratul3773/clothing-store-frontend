import { Badge, type Tone } from '@/components/cms/ui'
import { type Status } from '@/data/orders'
import { orderLabel } from '@/lib/order-rules'

const tone: Record<Status | 'DELIVERY_FAILED', Tone> = {
  PENDING_CONFIRMATION: 'amber', CONFIRMED: 'blue', PROCESSING: 'blue', PACKED: 'blue', COURIER_ASSIGNED: 'violet',
  SHIPPED: 'violet', OUT_FOR_DELIVERY: 'violet', DELIVERED: 'green', CANCELLED: 'red', RETURNED: 'red', EXCHANGED: 'gray',
  DELIVERY_FAILED: 'red',
}

export default function StatusBadge({ status }: { status: Status | 'DELIVERY_FAILED' }) {
  return <Badge tone={tone[status]}>{orderLabel(status)}</Badge>
}
