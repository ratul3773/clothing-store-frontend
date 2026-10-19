'use client'

import Link from 'next/link'
import { Ticket } from 'lucide-react'
import { coupons } from '@/data/catalog'
import { useCms } from '@/lib/useCms'

export default function CouponsTab() {
  useCms()
  return (
    <>
      {coupons.map((c) => (
        <div key={c.code} className="relative flex items-center gap-4 overflow-hidden rounded-[3px] border-2 border-dashed border-accent bg-accent/10 p-5">
          <Ticket className="text-accent" /><div><p className="font-display text-4xl">{c.code}</p><p className="text-sm text-muted-foreground">{c.note}</p></div>
        </div>
      ))}
      <Link href="/checkout" className="label-mono underline underline-offset-4">Use at checkout →</Link>
    </>
  )
}
