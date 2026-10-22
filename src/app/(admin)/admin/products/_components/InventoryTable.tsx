'use client'

import DataTable from '@/components/cms/DataTable'
import { Badge } from '@/components/cms/ui'
import { totalStock, type Product } from '@/data/catalog'
import { PAGE_SIZE } from '../_constants/products.constants'
import { stockState } from '../_utils/products.utils'
import StockBadge from './StockBadge'
import InventoryCell from './InventoryCell'

/** Quick stock adjustment per variant; sorted low-stock first by the parent. */
export default function InventoryTable({ rows, resetKey, lowStock }: { rows: Product[]; resetKey: string; lowStock: number }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(p) => p.id}
      pageSize={PAGE_SIZE}
      resetKey={resetKey}
      columns={[
        {
          key: 'name', header: 'Product',
          cell: (p) => (
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0]} alt="" className="size-9 rounded border border-border object-cover" />
              <div>
                <p className="max-w-48 truncate font-medium">{p.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{p.sku}</p>
              </div>
            </div>
          ),
        },
        { key: 'status', header: 'Status', cell: (p) => <Badge tone={p.status === 'active' ? 'green' : 'gray'}>{p.status}</Badge> },
        { key: 'variants', header: 'Stock per variant (color / size)', className: 'min-w-80', cell: (p) => <InventoryCell product={p} lowStock={lowStock} /> },
        { key: 'total', header: 'Total', align: 'right', cell: (p) => <span className="inline-flex items-center gap-1.5"><StockBadge state={stockState(p, lowStock)} />{totalStock(p)}</span> },
      ]}
    />
  )
}
