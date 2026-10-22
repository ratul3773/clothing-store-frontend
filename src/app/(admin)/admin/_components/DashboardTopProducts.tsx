import { Card, CardHeader, Empty } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import type { TopProduct } from '@/app/(admin)/admin/_types/dashboard.types'

export default function DashboardTopProducts({ rows }: { rows: TopProduct[] }) {
  return (
    <Card>
      <CardHeader title="Top-selling products" />
      {rows.length === 0 ? (
        <Empty title="No sales yet" />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 px-4 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt="" className="size-9 rounded object-cover" />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">{r.qty} sold</span>
              <span className="w-24 text-right text-[13px] tabular-nums">{bdt(r.revenue)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
