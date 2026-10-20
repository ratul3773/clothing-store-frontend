import type { Order } from '@/data/orders'
import { bdt } from '@/lib/utils'

export default function OrderItems({ o }: { o: Order }) {
  return (
    <div className="rounded-[3px] border border-border bg-card/70 p-6">
      {o.items.map((it, i) => (
        <div key={i} className="flex gap-4 border-b border-border py-3 last:border-0">
          <img src={it.image} alt="" className="h-24 w-[4.8rem] rounded-[2px] object-cover" />
          <div className="flex-1"><p className="font-semibold">{it.name}</p><p className="label-mono text-muted-foreground">{[it.color, it.size].filter(Boolean).join(' · ')} × {it.qty}</p></div>
          <p className="font-semibold">{bdt(it.price * it.qty)}</p>
        </div>
      ))}
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between"><dt>Delivery</dt><dd>{o.delivery ? bdt(o.delivery) : 'Free'}</dd></div>
        {o.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{bdt(o.discount)}</dd></div>}
        <div className="flex justify-between pt-2 text-lg font-bold"><dt>Total ({o.payment === 'COD' ? 'cash on delivery' : 'online'})</dt><dd>{bdt(o.total)}</dd></div>
      </dl>
    </div>
  )
}
