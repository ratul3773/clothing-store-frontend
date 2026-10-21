import { Card, CardHeader, Empty } from '@/components/cms/ui'
import StatusBadge from '@/components/cms/StatusBadge'
import type { Status } from '@/data/orders'

export default function DashboardStatusBreakdown({ rows }: { rows: { status: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <Card>
      <CardHeader title="Orders by status" />
      {rows.length === 0 ? (
        <Empty title="No orders yet" />
      ) : (
        <ul className="space-y-2.5 p-4">
          {rows.map((r) => (
            <li key={r.status} className="flex items-center gap-3">
              <div className="w-36 shrink-0"><StatusBadge status={r.status as Status} /></div>
              <div className="h-2 flex-1 rounded bg-muted"><div className="h-2 rounded bg-primary/70" style={{ width: `${(r.count / max) * 100}%` }} /></div>
              <span className="w-6 text-right text-[13px] tabular-nums">{r.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
