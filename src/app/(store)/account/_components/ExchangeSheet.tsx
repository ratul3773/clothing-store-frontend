'use client'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { Field, inputCls } from '@/components/common/FormField'
import { useStore } from '@/components/providers/StoreProvider'
import { byId } from '@/data/catalog'
import type useExchange from '@/app/(store)/account/_hooks/useExchange'

const REASONS = ['Too tight', 'Too loose', 'Wrong colour', 'Defect']

export default function ExchangeSheet({ x }: { x: ReturnType<typeof useExchange> }) {
  const { patchOrder, toast } = useStore()
  const { ex, close, reason, setReason, newSize, setNewSize } = x
  return (
    <Sheet open={!!ex} onOpenChange={(b) => !b && close()} title="Request exchange" description="Eligible within 7 days of delivery. Replacement stock is checked before approval." side="center">
      {ex && (
        <div className="space-y-4 p-5">
          <p className="text-sm font-semibold">{ex.items[0].name} · {ex.items[0].color} · {ex.items[0].size}</p>
          <Field label="Reason"><select className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
          <Field label="Replacement size">
            <div className="flex flex-wrap gap-2">{(byId(ex.items[0].productId)?.sizes ?? []).map((s) => <button key={s} onClick={() => setNewSize(s)} className={`h-11 min-w-12 rounded-[3px] border px-3 transition ${newSize === s ? 'border-foreground bg-foreground text-background' : 'border-foreground/30 hover:border-foreground'}`}>{s}</button>)}</div>
          </Field>
          <Button className="w-full" size="lg" variant="accent" disabled={!newSize} onClick={() => { patchOrder(ex.id, { exchange: { reason, size: newSize, state: 'REQUESTED' } }); close(); toast('Exchange requested') }}>Submit request</Button>
        </div>
      )}
    </Sheet>
  )
}
