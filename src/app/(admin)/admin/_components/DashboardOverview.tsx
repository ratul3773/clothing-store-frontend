'use client'

import { useMemo } from 'react'
import { PageHeader } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { useCms } from '@/lib/useCms'
import useNow from '@/lib/useNow'
import { products } from '@/data/catalog'
import { settings } from '@/data/site'
import { computeStats, lowStockProductCount, lowStockRows } from '@/app/(admin)/admin/_utils/dashboard.utils'
import DashboardKpis from '@/app/(admin)/admin/_components/DashboardKpis'
import DashboardRevenueChart from '@/app/(admin)/admin/_components/DashboardRevenueChart'
import DashboardStatusBreakdown from '@/app/(admin)/admin/_components/DashboardStatusBreakdown'
import DashboardTopProducts from '@/app/(admin)/admin/_components/DashboardTopProducts'
import DashboardRecentOrders from '@/app/(admin)/admin/_components/DashboardRecentOrders'
import DashboardLowStock from '@/app/(admin)/admin/_components/DashboardLowStock'
import DashboardSidePanels from '@/app/(admin)/admin/_components/DashboardSidePanels'

export default function DashboardOverview() {
  const { orders } = useStore()
  const v = useCms()
  const now = useNow(30_000)
  const stats = useMemo(() => now === null ? null : computeStats(orders, now), [orders, now])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const low = useMemo(() => lowStockRows(products, settings.orders.lowStock), [v])
  if (stats === null) {
    return (
      <div className="space-y-4">
        <PageHeader title="Dashboard" description="Store performance at a glance." />
        <p className="text-sm text-muted-foreground" role="status">Loading dashboard...</p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" description="Store performance at a glance." />
      <DashboardKpis stats={stats} lowStock={lowStockProductCount(low)} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><DashboardRevenueChart days={stats.days} /></div>
        <DashboardSidePanels now={now ?? 0} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardStatusBreakdown rows={stats.byStatus} />
        <DashboardTopProducts rows={stats.top} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><DashboardRecentOrders orders={orders} /></div>
        <DashboardLowStock rows={low} threshold={settings.orders.lowStock} />
      </div>
    </div>
  )
}
