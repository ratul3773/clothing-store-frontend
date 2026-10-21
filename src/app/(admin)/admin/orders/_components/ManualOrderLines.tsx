'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Btn, Input, Select } from '@/components/cms/ui'
import { priceOf, products } from '@/data/catalog'
import { uid } from '@/data/cms'
import { bdt } from '@/lib/utils'
import type { ManualLine } from '@/app/(admin)/admin/orders/_types/orders.types'

export default function ManualOrderLines({ lines, onChange, error }: { lines: ManualLine[]; onChange: (l: ManualLine[]) => void; error?: string }) {
  const [pid, setPid] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState('1')
  const [msg, setMsg] = useState('')
  const p = products.find((x) => x.id === pid)
  const avail = p && color && size ? (p.stock[`${color}|${size}`] ?? 0) : 0
  const inCart = (id: string, c: string, s: string) => lines.filter((l) => l.productId === id && l.color === c && l.size === s).reduce((a, l) => a + l.qty, 0)

  const add = () => {
    if (!p || !color || !size) return setMsg('Choose product, colour and size')
    const n = Math.floor(Number(qty))
    if (!(n >= 1)) return setMsg('Quantity must be at least 1')
    if (n + inCart(p.id, color, size) > avail) return setMsg(`Only ${avail} in stock for this variant`)
    const ex = lines.find((l) => l.productId === p.id && l.color === color && l.size === size)
    onChange(ex ? lines.map((l) => (l === ex ? { ...l, qty: l.qty + n } : l)) : [...lines, { key: uid('l'), productId: p.id, color, size, qty: n }])
    setMsg('')
    setQty('1')
  }

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-foreground/80">Products</p>
      <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/30 p-2 sm:grid-cols-5">
        <Select className="col-span-2" value={pid} onChange={(e) => { setPid(e.target.value); setColor(''); setSize('') }} aria-label="Product">
          <option value="">Select product…</option>
          {products.map((x) => <option key={x.id} value={x.id}>{x.name} · {bdt(priceOf(x))}</option>)}
        </Select>
        <Select value={color} onChange={(e) => { setColor(e.target.value); setSize('') }} disabled={!p} aria-label="Colour">
          <option value="">Colour</option>
          {p?.colors.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </Select>
        <Select value={size} onChange={(e) => setSize(e.target.value)} disabled={!color} aria-label="Size">
          <option value="">Size</option>
          {p?.sizes.map((s) => {
            const st = p.stock[`${color}|${s}`] ?? 0
            return <option key={s} value={s} disabled={st <= 0}>{s} ({st})</option>
          })}
        </Select>
        <div className="flex gap-2">
          <Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} aria-label="Quantity" />
          <Btn variant="primary" size="icon" onClick={add} aria-label="Add line"><Plus className="size-4" /></Btn>
        </div>
      </div>
      {(msg || error) && <p className="mt-1 text-xs text-red-600">{msg || error}</p>}
      {lines.length > 0 && (
        <table className="mt-2 w-full text-[13px]">
          <tbody>
            {lines.map((l) => {
              const lp = products.find((x) => x.id === l.productId)!
              return (
                <tr key={l.key} className="border-b border-border last:border-0">
                  <td className="py-1.5"><p className="font-medium">{lp.name}</p><p className="text-xs text-muted-foreground">{l.color} / {l.size}</p></td>
                  <td className="w-16"><Input type="number" min={1} value={l.qty} onChange={(e) => onChange(lines.map((x) => (x.key === l.key ? { ...x, qty: Math.max(1, Math.floor(Number(e.target.value)) || 1) } : x)))} /></td>
                  <td className="w-24 text-right tabular-nums">{bdt(priceOf(lp) * l.qty)}</td>
                  <td className="w-8 text-right"><Btn variant="ghost" size="icon" className="size-7" onClick={() => onChange(lines.filter((x) => x.key !== l.key))} aria-label="Remove"><Trash2 className="size-4" /></Btn></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
