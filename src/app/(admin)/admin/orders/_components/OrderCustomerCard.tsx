'use client'

import { useEffect, useState } from 'react'
import { Btn, Card, CardHeader, Field, Input, Select, Textarea } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { validateCustomer, type Errors } from '@/app/(admin)/admin/orders/_schemas/order.schema'
import { SOURCE_LABEL } from '@/app/(admin)/admin/orders/_constants/orders.constants'
import type { Order } from '@/data/orders'

export default function OrderCustomerCard({ order }: { order: Order }) {
  const { patchOrder, toast } = useStore()
  const [editing, setEditing] = useState(false)
  const [c, setC] = useState(order.customer)
  const [errors, setErrors] = useState<Errors>({})
  useEffect(() => { if (!editing) setC(order.customer) }, [order.customer, editing])

  const save = () => {
    const e = validateCustomer(c)
    setErrors(e)
    if (Object.keys(e).length) return
    patchOrder(order.id, { customer: { ...c, name: c.name.trim(), phone: c.phone.trim(), address: c.address.trim() } })
    setEditing(false)
    toast('Customer details updated')
  }

  return (
    <Card>
      <CardHeader title="Customer" actions={!editing && <Btn size="sm" onClick={() => setEditing(true)}>Edit</Btn>} />
      <div className="space-y-3 p-4 text-[13px]">
        {editing ? (
          <>
            <Field label="Name" error={errors.name}><Input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></Field>
            <Field label="Phone" error={errors.phone}><Input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></Field>
            <Field label="Address" error={errors.address}><Textarea className="min-h-16" value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} /></Field>
            <Field label="Zone">
              <Select value={c.zone} onChange={(e) => setC({ ...c, zone: e.target.value as typeof c.zone })}>
                <option value="dhaka">Dhaka</option>
                <option value="outside">Outside Dhaka</option>
              </Select>
            </Field>
            <div className="flex justify-end gap-2">
              <Btn onClick={() => { setEditing(false); setErrors({}) }}>Cancel</Btn>
              <Btn variant="primary" onClick={save}>Save</Btn>
            </div>
          </>
        ) : (
          <>
            <div><p className="font-medium">{order.customer.name}</p><p className="text-muted-foreground">{order.customer.phone}</p></div>
            <p>{order.customer.address}</p>
            <p className="text-xs text-muted-foreground">{order.customer.zone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'} · {SOURCE_LABEL[order.source]} · {order.guest ? 'Guest' : 'Registered'}</p>
            {order.customer.note && <p className="rounded bg-muted p-2 text-xs">Customer note: {order.customer.note}</p>}
          </>
        )}
      </div>
    </Card>
  )
}
