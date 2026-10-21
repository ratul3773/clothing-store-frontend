'use client'

import { Link2 } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import usePagination from '@/lib/usePagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/providers/StoreProvider'
import { products } from '@/data/catalog'
import { statusLabel, type Order } from '@/data/orders'
import { isExchangeEligible } from '@/app/(store)/account/_utils/account.utils'
import { bdt } from '@/lib/utils'

interface Props {
  linked: Order[]
  unlinked: Order[]
  onExchange: (o: Order) => void
}

export default function OrdersTab({ linked, unlinked, onExchange }: Props) {
  const { patchOrder, addItem, toast } = useStore()
  const pg = usePagination(linked, 3)
  return (
    <>
      {unlinked.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[3px] border border-accent bg-accent/10 p-5">
          <p className="flex items-center gap-3 text-sm"><Link2 size={18} className="text-accent" /> We found {unlinked.length} earlier guest order for your verified number.</p>
          <Button variant="accent" size="sm" onClick={() => { unlinked.forEach((o) => patchOrder(o.id, { guest: false })); toast('Previous orders linked') }}>Link to my account</Button>
        </div>
      )}
      {pg.pageItems.map((o) => (
        <div key={o.id} className="group rounded-[3px] border border-border bg-card/70 p-5 transition hover:border-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <img src={o.items[0].image} alt="" className="h-20 w-16 rounded-[2px] object-cover" />
            <div className="min-w-40 flex-1">
              <p className="label-mono text-muted-foreground">{o.id} · {new Date(o.createdAt).toLocaleDateString('en-GB')} · {o.source}</p>
              <p className="font-semibold">{o.items.map((i) => i.name).join(', ')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span>{bdt(o.total)}</span>
                <Badge>{statusLabel(o.status)}</Badge>
                {o.exchange && <><span>Exchange</span><Badge>{o.exchange.state[0] + o.exchange.state.slice(1).toLowerCase()}</Badge></>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button to={`/order?id=${o.id}`} size="sm" variant="outline">View</Button>
              <Button size="sm" variant="ghost" onClick={() => { o.items.forEach((i) => { const p = products.find((x) => x.id === i.productId && x.status === 'active'); if (p) addItem(p, i.color, i.size, i.qty, false) }); toast('Added to bag') }}>Reorder</Button>
              {isExchangeEligible(o) && <Button size="sm" variant="accent" onClick={() => onExchange(o)}>Request exchange</Button>}
            </div>
          </div>
        </div>
      ))}
      <Pagination page={pg.page} pageCount={pg.pageCount} onChange={pg.setPage} id="pg-orders" />
    </>
  )
}
