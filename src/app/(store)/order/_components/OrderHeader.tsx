'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { statusLabel, type Order } from '@/data/orders'
import { orderHeading } from '@/app/(store)/order/_utils/order.utils'

export default function OrderHeader({ o, dead }: { o: Order; dead: boolean }) {
  return (
    <>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.8 }} className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground"><Check size={30} strokeWidth={3} /></motion.div>
      <p className="label-mono text-muted-foreground">Order {o.id} · {o.source}</p>
      <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)]">{orderHeading(o.status, statusLabel(o.status))}</h1>
      <p className="mt-3 max-w-xl text-foreground/80">
        {o.status === 'PENDING_CONFIRMATION' ? 'Our team will confirm your order shortly, usually within a few hours. We will SMS you at ' + o.customer.phone + '.' : dead ? 'This order is closed.' : 'Your order is moving through our workflow.'}
      </p>
    </>
  )
}
