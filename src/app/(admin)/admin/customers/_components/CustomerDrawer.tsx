'use client'

import Link from 'next/link'
import { Ban, CheckCircle2, Mail, Phone, Plus } from 'lucide-react'
import { patchCustomer } from '@/data/cms'
import { bdt } from '@/lib/utils'
import { useStore } from '@/components/providers/StoreProvider'
import Modal from '@/components/cms/Modal'
import { Badge, Btn, Card } from '@/components/cms/ui'
import type { Customer } from '@/app/(admin)/admin/customers/_types/customer.types'
import { fmtDate } from '@/app/(admin)/admin/customers/_utils/customers.utils'
import CustomerOrders from '@/app/(admin)/admin/customers/_components/CustomerOrders'
import CustomerNotes from '@/app/(admin)/admin/customers/_components/CustomerNotes'

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="text-base font-semibold tabular-nums">{value}</p></Card>
)

export default function CustomerDrawer({ customer: c, onClose }: { customer: Customer | null; onClose: () => void }) {
  const { toast } = useStore()
  if (!c) return null
  const toggleBlock = () => {
    patchCustomer(c.key, { blocked: !c.blocked })
    toast(c.blocked ? 'Customer unblocked' : 'Customer blocked')
  }
  return (
    <Modal
      open
      onOpenChange={(o) => !o && onClose()}
      variant="drawer"
      title={c.name}
      description={`${c.segment} customer since ${fmtDate(c.firstOrder)}`}
      footer={
        <>
          <Link href={`/admin/orders/?new=1&phone=${encodeURIComponent(c.phone)}`}><Btn><Plus className="size-4" />Create manual order</Btn></Link>
          <Btn variant={c.blocked ? 'outline' : 'dangerOutline'} onClick={toggleBlock}>
            {c.blocked ? <CheckCircle2 className="size-4" /> : <Ban className="size-4" />}
            {c.blocked ? 'Unblock' : 'Block customer'}
          </Btn>
        </>
      }
    >
      <div className="space-y-5">
        <section className="space-y-1 text-[13px]">
          <div className="flex gap-1"><Badge tone="violet">{c.segment}</Badge>{c.blocked && <Badge tone="red">Blocked</Badge>}</div>
          <p className="flex items-center gap-2 pt-1"><Phone className="size-3.5 text-muted-foreground" /><a className="text-primary hover:underline" href={`tel:${c.key}`}>{c.phone}</a></p>
          {c.email && <p className="flex items-center gap-2"><Mail className="size-3.5 text-muted-foreground" /><a className="text-primary hover:underline" href={`mailto:${c.email}`}>{c.email}</a></p>}
          <div className="pt-1">
            <p className="text-xs text-muted-foreground">Addresses</p>
            {c.addresses.map((a) => <p key={a}>{a}</p>)}
          </div>
        </section>
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Orders" value={c.orderCount} />
          <Stat label="Lifetime spend" value={bdt(c.spend)} />
          <Stat label="AOV" value={bdt(c.aov)} />
          <Stat label="Last order" value={fmtDate(c.lastOrder)} />
        </section>
        <section><h4 className="mb-2 text-sm font-semibold">Order history</h4><CustomerOrders orders={c.orders} /></section>
        <section><CustomerNotes key={c.key} customer={c} /></section>
      </div>
    </Modal>
  )
}
