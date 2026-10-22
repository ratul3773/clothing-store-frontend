'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { products } from '@/data/catalog'
import { useCms } from '@/lib/useCms'
import { useStore } from '@/components/providers/StoreProvider'
import DataTable from '@/components/cms/DataTable'
import { Badge, Card, Input, PageHeader, Select, Toolbar } from '@/components/cms/ui'
import type { Review } from '@/data/reviews'
import { EMPTY_FILTERS } from '@/app/(admin)/admin/reviews/_constants/reviews.constants'
import type { ReviewFilters } from '@/app/(admin)/admin/reviews/_types/review.types'
import { filterReviews, fmtDate, productOf, stars, statusOf } from '@/app/(admin)/admin/reviews/_utils/reviews.utils'
import ReviewStats from '@/app/(admin)/admin/reviews/_components/ReviewStats'
import ReviewDetailModal from '@/app/(admin)/admin/reviews/_components/ReviewDetailModal'

const tone = { Published: 'blue', Hidden: 'red', Replied: 'green' } as const

export default function ReviewsTable() {
  useCms()
  const { reviews } = useStore()
  const [f, setF] = useState<ReviewFilters>(EMPTY_FILTERS)
  const [openId, setOpenId] = useState<string | null>(null)
  const set = (k: keyof ReviewFilters) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }))
  const rows = useMemo(() => filterReviews(reviews, f), [reviews, f])

  return (
    <>
      <PageHeader title="Reviews" description="Moderate customer reviews and reply publicly." crumbs={['Admin', 'Reviews']} />
      <ReviewStats reviews={reviews} />
      <Card>
        <Toolbar>
          <div className="relative min-w-52 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search author, text, product" value={f.q} onChange={set('q')} />
          </div>
          <Select className="w-28" value={f.rating} onChange={set('rating')} aria-label="Rating">
            <option value="">Any rating</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </Select>
          <Select className="w-32" value={f.status} onChange={set('status')} aria-label="Status">
            <option value="">Any status</option>
            <option>Published</option>
            <option>Replied</option>
            <option>Hidden</option>
          </Select>
          <Select className="w-44" value={f.product} onChange={set('product')} aria-label="Product">
            <option value="">All products</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Select className="w-32" value={f.images} onChange={set('images')} aria-label="Images">
            <option value="">Images: any</option>
            <option value="yes">With images</option>
            <option value="no">No images</option>
          </Select>
          <Select className="w-32" value={f.reply} onChange={set('reply')} aria-label="Reply">
            <option value="">Reply: any</option>
            <option value="replied">Replied</option>
            <option value="unreplied">Unreplied</option>
          </Select>
        </Toolbar>
        <DataTable<Review>
          rows={rows}
          rowKey={(r) => r.id}
          resetKey={JSON.stringify(f)}
          onRowClick={(r) => setOpenId(r.id)}
          columns={[
            {
              key: 'product',
              header: 'Product',
              cell: (r) => {
                const p = productOf(r.productId)
                return (
                  <div className="flex items-center gap-2">
                    {p?.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt="" className="size-9 rounded border border-border object-cover" />
                    )}
                    <span className="font-medium">{p?.name ?? r.productId}</span>
                  </div>
                )
              },
            },
            { key: 'author', header: 'Author', cell: (r) => r.author },
            { key: 'rating', header: 'Rating', cell: (r) => <span className="tracking-wide text-amber-500">{stars(r.rating)}</span> },
            { key: 'fit', header: 'Fit', cell: (r) => r.fit },
            { key: 'text', header: 'Review', className: 'max-w-64', cell: (r) => <span className="line-clamp-2 text-muted-foreground">{r.text}</span> },
            { key: 'imgs', header: 'Images', align: 'right', cell: (r) => r.images.length },
            { key: 'status', header: 'Status', cell: (r) => <Badge tone={tone[statusOf(r)]}>{statusOf(r)}</Badge> },
            { key: 'date', header: 'Date', className: 'whitespace-nowrap', cell: (r) => fmtDate(r.createdAt) },
          ]}
        />
      </Card>
      <ReviewDetailModal id={openId} onClose={() => setOpenId(null)} />
    </>
  )
}
