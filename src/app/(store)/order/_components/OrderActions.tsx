'use client'

import Link from 'next/link'
import { ExternalLink, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'
import type { Order } from '@/data/orders'
import { trackingUrl } from '@/app/(store)/order/_utils/order.utils'

export default function OrderActions({ o, dead }: { o: Order; dead: boolean }) {
  const { patchOrder, toast } = useStore()
  const track = trackingUrl(o)
  return (
    <div className="space-y-4">
      <div className="rounded-[3px] border border-border p-5 text-sm"><p className="label-mono mb-2 text-muted-foreground">Deliver to</p><p className="font-semibold">{o.customer.name}</p><p>{o.customer.phone}</p><p className="text-muted-foreground">{o.customer.address}</p></div>
      {track && <Button variant="outline" className="w-full" onClick={() => window.open(track, '_blank')}><ExternalLink size={15} /> Track with {o.courier} · {o.consignment}</Button>}
      {o.status === 'PENDING_CONFIRMATION' && <Button variant="accent" className="w-full" onClick={() => { patchOrder(o.id, { status: 'CANCELLED' }); toast('Order cancelled') }}>Cancel order</Button>}
      {o.status !== 'PENDING_CONFIRMATION' && !dead && <p className="text-xs text-muted-foreground">Cancellation is only available before the owner confirms.</p>}
      <Button variant="ghost" className="w-full" onClick={() => window.open('https://wa.me/8801700000000', '_blank')}><MessageCircle size={15} /> Ask on WhatsApp</Button>
      <Link href="/shop" className="label-mono block text-center underline underline-offset-4">Continue shopping</Link>
    </div>
  )
}
