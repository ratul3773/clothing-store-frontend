import Link from 'next/link'
import { Card, CardHeader, Empty, Badge } from '@/components/cms/ui'
import type { LowStockRow } from '@/app/(admin)/admin/_types/dashboard.types'

export default function DashboardLowStock({ rows, threshold }: { rows: LowStockRow[]; threshold: number }) {
  return (
    <Card>
      <CardHeader title="Low stock" description={`Variants at or below ${threshold} units`} />
      {rows.length === 0 ? (
        <Empty title="No low-stock variants" />
      ) : (
        <ul className="max-h-72 divide-y divide-border overflow-y-auto">
          {rows.slice(0, 30).map((r) => (
            <li key={`${r.id}${r.variant}`} className="flex items-center justify-between gap-3 px-4 py-2 text-[13px]">
              <div className="min-w-0">
                <Link href="/admin/products" className="block truncate font-medium hover:text-primary">{r.name}</Link>
                <span className="text-xs text-muted-foreground">{r.variant}</span>
              </div>
              <Badge tone={r.qty === 0 ? 'red' : 'amber'}>{r.qty === 0 ? 'Out of stock' : `${r.qty} left`}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
