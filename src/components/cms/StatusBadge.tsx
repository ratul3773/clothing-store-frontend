import { Badge, type Tone } from '@/components/cms/ui'
import { statusLabel, type Status } from '@/data/orders'

const tone: Record<Status, Tone> = {
  PENDING_CONFIRMATION: 'amber', CONFIRMED: 'blue', PROCESSING: 'blue', PACKED: 'blue', COURIER_ASSIGNED: 'violet',
  SHIPPED: 'violet', OUT_FOR_DELIVERY: 'violet', DELIVERED: 'green', CANCELLED: 'red', RETURNED: 'red', EXCHANGED: 'gray',
}

export default function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={tone[status]}>{statusLabel(status)}</Badge>
}
