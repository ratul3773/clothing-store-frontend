'use client'

import { useState } from 'react'
import { Btn, Card, CardHeader, Input } from '@/components/cms/ui'
import { stockKey } from '../_utils/products.utils'
import type { SectionProps } from './sectionProps'

export default function StockMatrix({ d, patch }: SectionProps) {
  const [amount, setAmount] = useState('10')
  const n = Math.max(0, Math.floor(Number(amount) || 0))
  const named = d.colors.filter((c) => c.name.trim())
  const apply = (fn: (cur: number) => number) => {
    const stock = { ...d.stock }
    named.forEach((c) => d.sizes.forEach((s) => (stock[stockKey(c.name, s)] = fn(stock[stockKey(c.name, s)] ?? 0))))
    patch({ stock })
  }
  const total = named.reduce((a, c) => a + d.sizes.reduce((b, s) => b + (d.stock[stockKey(c.name, s)] ?? 0), 0), 0)
  return (
    <Card>
      <CardHeader title="Stock" description={`Total units: ${total}`} />
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input type="number" min={0} className="w-24" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Amount" />
          <Btn size="sm" onClick={() => apply(() => n)}>Set all to {n}</Btn>
          <Btn size="sm" onClick={() => apply((c) => c + n)}>Add {n} to all</Btn>
        </div>
        {named.length === 0 || d.sizes.length === 0 ? (
          <p className="text-xs text-muted-foreground">Add at least one named color and one size to manage stock.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="text-[13px]">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="px-2 py-1 text-left font-medium">Color</th>
                  {d.sizes.map((s) => <th key={s} className="px-1 py-1 font-medium">{s}</th>)}
                </tr>
              </thead>
              <tbody>
                {named.map((c) => (
                  <tr key={c.name}>
                    <td className="whitespace-nowrap px-2 py-1"><span className="mr-1.5 inline-block size-3 rounded-full border border-border align-middle" style={{ background: c.hex }} />{c.name}</td>
                    {d.sizes.map((s) => (
                      <td key={s} className="px-1 py-1">
                        <Input type="number" min={0} className="w-16 text-center" aria-label={`${c.name} ${s}`} value={d.stock[stockKey(c.name, s)] ?? 0} onChange={(e) => patch({ stock: { ...d.stock, [stockKey(c.name, s)]: Math.max(0, Math.floor(Number(e.target.value) || 0)) } })} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
