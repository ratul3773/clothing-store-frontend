'use client'

import { useState } from 'react'
import { Btn, Card, CardHeader, Textarea } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { fmtDate } from '@/app/(admin)/admin/orders/_utils/orders.utils'
import type { Order } from '@/data/orders'

export default function OrderNotesCard({ order }: { order: Order }) {
  const { patchOrder, toast } = useStore()
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const notes = [...(order.notes ?? [])].reverse()
  const add = () => {
    if (!text.trim()) return setErr('Write a note first')
    setErr('')
    patchOrder(order.id, { notes: [...(order.notes ?? []), { text: text.trim(), at: new Date().toISOString() }] })
    setText('')
    toast('Note added')
  }
  return (
    <Card>
      <CardHeader title="Internal notes" description="Only visible to staff" />
      <div className="space-y-3 p-4">
        <Textarea className="min-h-16" placeholder="Add a note…" value={text} onChange={(e) => setText(e.target.value)} />
        {err && <p className="text-xs text-red-600">{err}</p>}
        <Btn variant="primary" onClick={add}>Add note</Btn>
        {notes.length > 0 && (
          <ul className="space-y-2 border-t border-border pt-3">
            {notes.map((n, i) => (
              <li key={i} className="rounded bg-muted/60 p-2 text-[13px]"><p>{n.text}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{fmtDate(n.at)}</p></li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
