'use client'

import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Btn, PageHeader } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { useCms } from '@/lib/useCms'
import { RANGES } from '@/app/(admin)/admin/reports/_constants/reports.constants'
import type { RangeKey } from '@/app/(admin)/admin/reports/_types/reports.types'
import { categoryOf, downloadCsv, filterByRange, groupItems, groupOrders, ordersToCsv, subOf, summarize } from '@/app/(admin)/admin/reports/_utils/reports.utils'
import ReportsSummary from '@/app/(admin)/admin/reports/_components/ReportsSummary'
import ReportsTable from '@/app/(admin)/admin/reports/_components/ReportsTable'

export default function ReportsView() {
  const { orders, toast } = useStore()
  const v = useCms()
  const [range, setRange] = useState<RangeKey>('30d')
  const list = useMemo(() => filterByRange(orders, range), [orders, range])
  const d = useMemo(
    () => ({
      summary: summarize(list),
      cat: groupItems(list, (id) => categoryOf(id)),
      sub: groupItems(list, (id) => subOf(id)),
      pay: groupOrders(list, (o) => o.payment),
      src: groupOrders(list, (o) => o.source),
      zone: groupOrders(list, (o) => (o.customer.zone === 'dhaka' ? 'Dhaka' : 'Outside Dhaka')),
      top: groupItems(list, (_id, name) => name),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, v],
  )
  const exportCsv = () => {
    downloadCsv(`orders-${range}-${new Date().toISOString().slice(0, 10)}.csv`, ordersToCsv(list))
    toast(`Exported ${list.length} orders`)
  }
  return (
    <div className="space-y-4">
      <PageHeader
        title="Reports"
        description="Sales performance and breakdowns."
        actions={
          <>
            <div className="inline-flex overflow-hidden rounded-md border border-border bg-card">
              {RANGES.map((r) => (
                <button key={r.key} onClick={() => setRange(r.key)} className={`h-8 px-3 text-[13px] ${range === r.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  {r.key === 'all' ? 'All' : r.key}
                </button>
              ))}
            </div>
            <Btn onClick={exportCsv} disabled={!list.length}><Download className="size-4" /> Export CSV</Btn>
          </>
        }
      />
      <ReportsSummary s={d.summary} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ReportsTable title="Revenue by category" firstHeader="Category" rows={d.cat} />
        <ReportsTable title="Revenue by subcategory" firstHeader="Subcategory" rows={d.sub} />
        <ReportsTable title="By payment method" firstHeader="Payment" rows={d.pay} />
        <ReportsTable title="By source" firstHeader="Source" rows={d.src} />
        <ReportsTable title="By delivery zone" firstHeader="Zone" rows={d.zone} />
      </div>
      <ReportsTable title="Top products" firstHeader="Product" rows={d.top} pageSize={10} />
    </div>
  )
}
