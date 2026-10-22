'use client'

import { Badge, Card, CardHeader } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import type { ProductDraft } from '../_types/products.types'
import { toNum } from '../_utils/products.utils'

export default function ProductPreview({ d }: { d: ProductDraft }) {
  const price = toNum(d.price)
  const offer = toNum(d.offer)
  const hasOffer = !Number.isNaN(offer) && !Number.isNaN(price) && offer < price
  return (
    <Card>
      <CardHeader title="Preview" />
      <div className="p-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {d.images[0] && <img src={d.images[0]} alt="" className="size-full object-cover" />}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">{d.badges.map((b) => <Badge key={b} tone="blue">{b}</Badge>)}</div>
        </div>
        <p className="mt-2 truncate text-sm font-medium">{d.name || 'Product name'}</p>
        <p className="text-xs text-muted-foreground">{d.sub || 'Subcategory'} · {d.sku || 'SKU'}</p>
        <p className="mt-1 text-sm">
          {hasOffer ? <><span className="font-semibold">{bdt(offer)}</span> <span className="text-xs text-muted-foreground line-through">{bdt(price)}</span></> : <span className="font-semibold">{Number.isNaN(price) ? bdt(0) : bdt(price)}</span>}
        </p>
        <div className="mt-2 flex gap-1">{d.colors.map((c, i) => <span key={i} className="size-4 rounded-full border border-border" style={{ background: c.hex }} title={c.name} />)}</div>
        <p className="mt-2 text-xs text-muted-foreground">{d.sizes.join(' · ')}</p>
        <Badge tone={d.status === 'active' ? 'green' : 'gray'} className="mt-2">{d.status === 'active' ? 'Active' : 'Draft'}</Badge>
      </div>
    </Card>
  )
}
