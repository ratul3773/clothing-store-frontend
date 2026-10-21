import Link from 'next/link'
import { bdt } from '@/lib/utils'
import StatusBadge from '@/components/cms/StatusBadge'
import type { Order } from '@/data/orders'
import { fmtDate } from '@/app/(admin)/admin/customers/_utils/customers.utils'

export default function CustomerOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
            <th className="px-3 py-2 font-medium">Order</th>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border last:border-0">
              <td className="px-3 py-2"><Link className="font-medium text-primary hover:underline" href={`/admin/orders/?id=${o.id}`}>{o.id}</Link></td>
              <td className="px-3 py-2">{fmtDate(o.createdAt)}</td>
              <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
              <td className="px-3 py-2 text-right tabular-nums">{bdt(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
