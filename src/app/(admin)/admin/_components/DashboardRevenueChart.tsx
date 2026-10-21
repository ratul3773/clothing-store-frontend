import { Card, CardHeader } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import type { DayPoint } from '@/app/(admin)/admin/_types/dashboard.types'

export default function DashboardRevenueChart({ days }: { days: DayPoint[] }) {
  const max = Math.max(1, ...days.map((d) => d.revenue))
  const total = days.reduce((a, d) => a + d.revenue, 0)
  return (
    <Card>
      <CardHeader title="Revenue by day" description={`Last ${days.length} days · ${bdt(total)}`} />
      <div className="p-4">
        <div className="flex h-44 items-end gap-1.5">
          {days.map((d) => (
            <div key={d.key} className="flex h-full flex-1 flex-col justify-end" title={`${d.label}: ${bdt(d.revenue)} (${d.orders} orders)`}>
              <div className="w-full rounded-t bg-primary/80 hover:bg-primary" style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue ? 2 : 0 }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5 text-[10px] text-muted-foreground">
          {days.map((d, i) => (
            <span key={d.key} className="flex-1 text-center">{i % 2 === 0 ? d.label : ''}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}
