'use client'

import { Copy, Pencil, Trash2 } from 'lucide-react'
import DataTable from '@/components/cms/DataTable'
import { Badge, Btn } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import { taxonomy, totalStock, type Product } from '@/data/catalog'
import { PAGE_SIZE } from '../_constants/products.constants'
import { stockState } from '../_utils/products.utils'
import StockBadge from './StockBadge'

type Props = {
  rows: Product[]
  resetKey: string
  selected: string[]
  onSelect: (k: string[]) => void
  lowStock: number
  onEdit: (p: Product) => void
  onDuplicate: (p: Product) => void
  onDelete: (p: Product) => void
}

export default function ProductsTable({ rows, resetKey, selected, onSelect, lowStock, onEdit, onDuplicate, onDelete }: Props) {
  return (
    <DataTable
      rows={rows}
      rowKey={(p) => p.id}
      pageSize={PAGE_SIZE}
      resetKey={resetKey}
      selected={selected}
      onSelect={onSelect}
      onRowClick={onEdit}
      columns={[
        {
          key: 'name', header: 'Product',
          cell: (p) => (
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0]} alt="" className="size-10 rounded border border-border object-cover" />
              <div className="min-w-0">
                <p className="max-w-56 truncate font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">/{p.slug}</p>
              </div>
            </div>
          ),
        },
        { key: 'sku', header: 'SKU', cell: (p) => <span className="font-mono text-xs">{p.sku}</span> },
        { key: 'cat', header: 'Category', cell: (p) => <span>{taxonomy.find((t) => t.cat === p.category)?.label ?? p.category}<span className="text-muted-foreground"> / {p.sub}</span></span> },
        { key: 'price', header: 'Price', align: 'right', cell: (p) => bdt(p.price) },
        { key: 'offer', header: 'Offer', align: 'right', cell: (p) => (p.offer ? bdt(p.offer) : <span className="text-muted-foreground">-</span>) },
        { key: 'stock', header: 'Stock', align: 'right', cell: (p) => <span className="inline-flex items-center justify-end gap-1.5"><StockBadge state={stockState(p, lowStock)} />{totalStock(p)}</span> },
        { key: 'status', header: 'Status', cell: (p) => <Badge tone={p.status === 'active' ? 'green' : 'gray'}>{p.status === 'active' ? 'Active' : 'Draft'}</Badge> },
        { key: 'sold', header: 'Sold', align: 'right', cell: (p) => p.sold },
        {
          key: 'actions', header: '', align: 'right',
          cell: (p) => (
            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Btn size="icon" variant="ghost" className="size-7" aria-label="Edit" onClick={() => onEdit(p)}><Pencil className="size-3.5" /></Btn>
              <Btn size="icon" variant="ghost" className="size-7" aria-label="Duplicate" onClick={() => onDuplicate(p)}><Copy className="size-3.5" /></Btn>
              <Btn size="icon" variant="ghost" className="size-7 text-red-600" aria-label="Delete" onClick={() => onDelete(p)}><Trash2 className="size-3.5" /></Btn>
            </div>
          ),
        },
      ]}
    />
  )
}
