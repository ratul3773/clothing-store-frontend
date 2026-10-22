import { Card, CardHeader } from '@/components/cms/ui'
import { bdt } from '@/lib/utils'
import type { Order } from '@/data/orders'

export default function OrderItemsCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader title="Items" description={`${order.items.reduce((a, i) => a + i.qty, 0)} units`} />
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
            <th className="px-4 py-2 text-left font-medium">Product</th>
            <th className="px-2 py-2 text-right font-medium">Price</th>
            <th className="px-2 py-2 text-right font-medium">Qty</th>
            <th className="px-4 py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i, n) => (
            <tr key={n} className="border-b border-border last:border-0">
              <td className="px-4 py-2">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt="" className="size-10 rounded object-cover" />
                  <div><p className="font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.color} / {i.size}</p></div>
                </div>
              </td>
              <td className="px-2 py-2 text-right tabular-nums">{bdt(i.price)}</td>
              <td className="px-2 py-2 text-right tabular-nums">{i.qty}</td>
              <td className="px-4 py-2 text-right tabular-nums">{bdt(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="ml-auto w-full max-w-xs space-y-1 border-t border-border px-4 py-3 text-[13px]">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{bdt(order.subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{bdt(order.delivery)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd className="tabular-nums">-{bdt(order.discount)}</dd></div>
        <div className="flex justify-between border-t border-border pt-1 text-sm font-semibold"><dt>Total</dt><dd className="tabular-nums">{bdt(order.total)}</dd></div>
      </dl>
    </Card>
  )
}
