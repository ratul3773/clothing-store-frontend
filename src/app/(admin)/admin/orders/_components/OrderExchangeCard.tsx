'use client'

import { Badge, Btn, Card, CardHeader } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import type { Order } from '@/data/orders'

export default function OrderExchangeCard({ order }: { order: Order }) {
  const { patchOrder, toast } = useStore()
  const ex = order.exchange!
  const decide = (state: 'APPROVED' | 'REJECTED') => {
    patchOrder(order.id, {
      exchange: { ...ex, state },
      notes: [...(order.notes ?? []), { text: `Exchange request ${state.toLowerCase()} (size ${ex.size})`, at: new Date().toISOString() }],
    })
    toast(`Exchange ${state.toLowerCase()}`)
  }
  return (
    <Card>
      <CardHeader title="Exchange request" actions={<Badge tone={ex.state === 'APPROVED' ? 'green' : ex.state === 'REJECTED' ? 'red' : 'amber'}>{ex.state.toLowerCase()}</Badge>} />
      <div className="space-y-2 p-4 text-[13px]">
        <p><span className="text-muted-foreground">Requested size:</span> {ex.size}</p>
        <p><span className="text-muted-foreground">Reason:</span> {ex.reason}</p>
        {ex.state === 'REQUESTED' && (
          <div className="flex gap-2 pt-1">
            <Btn variant="primary" onClick={() => decide('APPROVED')}>Approve</Btn>
            <Btn variant="dangerOutline" onClick={() => decide('REJECTED')}>Reject</Btn>
          </div>
        )}
      </div>
    </Card>
  )
}
