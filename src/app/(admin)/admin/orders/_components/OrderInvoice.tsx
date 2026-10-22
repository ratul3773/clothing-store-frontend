import { bdt } from '@/lib/utils'
import { settings } from '@/data/site'
import { fmtDate } from '@/app/(admin)/admin/orders/_utils/orders.utils'
import type { Order } from '@/data/orders'

/** Hidden on screen; the only thing visible when printing. */
export default function OrderInvoice({ order }: { order: Order }) {
  return (
    <>
      <style>{`@media print { body * { visibility: hidden !important; } #order-invoice, #order-invoice * { visibility: visible !important; } #order-invoice { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; background: #fff; color: #000; } }`}</style>
      <div id="order-invoice" className="hidden text-[13px] print:block">
        <div className="flex justify-between border-b border-black pb-3">
          <div>
            <h1 className="text-xl font-bold">{settings.store.name}</h1>
            <p>{settings.store.address}</p>
            <p>{settings.store.phone} · {settings.store.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold">INVOICE</h2>
            <p>{order.id}</p>
            <p>{fmtDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="my-4">
          <p className="font-semibold">Bill to</p>
          <p>{order.customer.name}</p>
          <p>{order.customer.phone}</p>
          <p>{order.customer.address}</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black text-left"><th className="py-1">Item</th><th>Qty</th><th className="text-right">Price</th><th className="text-right">Total</th></tr>
          </thead>
          <tbody>
            {order.items.map((i, n) => (
              <tr key={n} className="border-b border-gray-300">
                <td className="py-1">{i.name} ({i.color} / {i.size})</td><td>{i.qty}</td><td className="text-right">{bdt(i.price)}</td><td className="text-right">{bdt(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="ml-auto mt-3 w-60 space-y-1">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{bdt(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{bdt(order.delivery)}</dd></div>
          <div className="flex justify-between"><dt>Discount</dt><dd>-{bdt(order.discount)}</dd></div>
          <div className="flex justify-between border-t border-black pt-1 font-bold"><dt>Total</dt><dd>{bdt(order.total)}</dd></div>
          <div className="flex justify-between"><dt>Payment</dt><dd>{order.payment} · {order.paid ? 'Paid' : 'Due'}</dd></div>
        </dl>
        <p className="mt-8 text-center text-xs">Thank you for shopping with {settings.store.name}.</p>
      </div>
    </>
  )
}
