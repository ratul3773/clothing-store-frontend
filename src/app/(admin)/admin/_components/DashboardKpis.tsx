import { StatCard } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import type { DashboardStats } from '@/app/(admin)/admin/_types/dashboard.types'

export default function DashboardKpis({ stats, lowStock }: { stats: DashboardStats; lowStock: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard label="Revenue today" value={bdt(stats.today)} />
      <StatCard label="Revenue (7 days)" value={bdt(stats.week)} />
      <StatCard label="Revenue (30 days)" value={bdt(stats.month)} />
      <StatCard label="Average order value" value={bdt(stats.aov)} />
      <StatCard label="Total orders" value={stats.orderCount} />
      <StatCard label="Pending orders" value={stats.pending} hint={stats.pending ? 'Needs confirmation' : 'All caught up'} tone={stats.pending ? 'bad' : 'good'} />
      <StatCard label="New customers (30 days)" value={stats.newCustomers} />
      <StatCard label="Low-stock products" value={lowStock} tone={lowStock ? 'bad' : 'good'} hint={lowStock ? 'Restock soon' : 'Healthy'} />
    </div>
  )
}
