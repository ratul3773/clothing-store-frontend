'use client'

import { Check } from 'lucide-react'
import { Btn, Card, CardHeader } from '@/components/cms/ui'
import { LIFECYCLE, statusLabel, type Order } from '@/data/orders'
import { cn } from '@/lib/utils'
import useOrderActions from '@/app/(admin)/admin/orders/_hooks/useOrderActions'
import { fmtDate } from '@/app/(admin)/admin/orders/_utils/orders.utils'

export default function OrderStatusCard({ order }: { order: Order }) {
  const { setStatus } = useOrderActions()
  const idx = (LIFECYCLE as readonly string[]).indexOf(order.status)
  const terminal = idx === -1
  const next = !terminal && idx < LIFECYCLE.length - 1 ? LIFECYCLE[idx + 1] : null
  const at = (s: string) => order.history?.slice().reverse().find((h) => h.status === s)?.at
  return (
    <Card>
      <CardHeader title="Status" />
      <ol className="space-y-0 px-4 pt-3">
        {LIFECYCLE.map((s, i) => {
          const done = !terminal && i <= idx
          const t = at(s)
          return (
            <li key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={cn('flex size-5 items-center justify-center rounded-full border text-[10px]', done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground')}>
                  {done ? <Check className="size-3" /> : i + 1}
                </span>
                {i < LIFECYCLE.length - 1 && <span className={cn('min-h-3 w-px flex-1', done && i < idx ? 'bg-primary' : 'bg-border')} />}
              </div>
              <button
                type="button"
                onClick={() => setStatus(order, s)}
                className={cn('-mt-0.5 mb-1.5 flex-1 rounded px-1 text-left text-[13px] hover:bg-muted', i === idx ? 'font-semibold' : done ? '' : 'text-muted-foreground')}
              >
                {statusLabel(s)}
                {t && <span className="ml-2 text-[11px] font-normal text-muted-foreground">{fmtDate(t)}</span>}
              </button>
            </li>
          )
        })}
      </ol>
      {terminal && <p className="px-4 pb-1 text-[13px] font-medium text-red-600">Order is {statusLabel(order.status).toLowerCase()}.</p>}
      <div className="flex flex-wrap gap-2 p-4">
        {next && <Btn variant="primary" onClick={() => setStatus(order, next)}>Mark {statusLabel(next).toLowerCase()}</Btn>}
        {terminal && <Btn onClick={() => setStatus(order, 'PENDING_CONFIRMATION')}>Reopen order</Btn>}
        {order.status !== 'CANCELLED' && order.status !== 'RETURNED' && <Btn variant="dangerOutline" onClick={() => setStatus(order, 'CANCELLED')}>Cancel</Btn>}
        {order.status === 'DELIVERED' && <Btn variant="dangerOutline" onClick={() => setStatus(order, 'RETURNED')}>Return</Btn>}
      </div>
    </Card>
  )
}
