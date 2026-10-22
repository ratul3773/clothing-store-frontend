import { StatCard } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import type { Summary } from '@/app/(admin)/admin/reports/_types/reports.types'

export default function ReportsSummary({ s }: { s: Summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard label="Net sales" value={bdt(s.net)} hint={`${bdt(s.paid)} collected`} />
      <StatCard label="Orders" value={s.orders} hint={`${s.cancelled} cancelled / returned`} />
      <StatCard label="Average order value" value={bdt(s.aov)} />
      <StatCard label="Units sold" value={s.units} />
      <StatCard label="Gross (items)" value={bdt(s.gross)} />
      <StatCard label="Delivery charges" value={bdt(s.delivery)} />
      <StatCard label="Discounts" value={bdt(s.discount)} />
      <StatCard label="Outstanding" value={bdt(s.net - s.paid)} hint="Not yet marked paid" />
    </div>
  )
}
