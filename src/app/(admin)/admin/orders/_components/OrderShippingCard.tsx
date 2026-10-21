'use client'

import { useEffect, useState } from 'react'
import { Badge, Btn, Card, CardHeader, Field, Input, Select, Switch } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { COURIERS } from '@/app/(admin)/admin/orders/_constants/orders.constants'
import type { Order } from '@/data/orders'

export default function OrderShippingCard({ order }: { order: Order }) {
  const { patchOrder, toast } = useStore()
  const [courier, setCourier] = useState<string>(order.courier ?? '')
  const [cn, setCn] = useState(order.consignment ?? '')
  const [err, setErr] = useState('')
  useEffect(() => { setCourier(order.courier ?? ''); setCn(order.consignment ?? '') }, [order.courier, order.consignment])

  const save = () => {
    if (courier && !cn.trim()) return setErr('Consignment number is required')
    setErr('')
    patchOrder(order.id, { courier: (courier || undefined) as Order['courier'], consignment: courier ? cn.trim() : undefined })
    toast(courier ? `Assigned to ${courier}` : 'Courier cleared')
  }

  return (
    <Card>
      <CardHeader title="Shipping & payment" />
      <div className="space-y-3 p-4">
        <Field label="Courier">
          <Select value={courier} onChange={(e) => setCourier(e.target.value)}>
            <option value="">Not assigned</option>
            {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="Consignment number" error={err}><Input value={cn} disabled={!courier} onChange={(e) => setCn(e.target.value)} placeholder="e.g. PT-1234567" /></Field>
        <Btn onClick={save}>Save courier</Btn>
        <div className="space-y-2 border-t border-border pt-3 text-[13px]">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Method</span><span>{order.payment}</span></div>
          <div className="flex items-center justify-between">
            <Badge tone={order.paid ? 'green' : 'amber'}>{order.paid ? 'Paid' : 'Unpaid'}</Badge>
            <Switch checked={!!order.paid} onChange={(v) => { patchOrder(order.id, { paid: v }); toast(v ? 'Marked as paid' : 'Marked as unpaid') }} label="Payment received" />
          </div>
        </div>
      </div>
    </Card>
  )
}
