'use client'

import Link from 'next/link'
import { Mail, Zap } from 'lucide-react'
import { Badge, Card } from '@/components/cms/ui'
import { messages } from '@/data/cms'
import { flashSales, isFlashLive } from '@/data/site'
import { products } from '@/data/catalog'

export default function DashboardSidePanels({ now }: { now: number }) {
  const unread = messages.filter((m) => m.status === 'new').length
  const flash = flashSales.find((f) => isFlashLive(f, now))
  return (
    <div className="space-y-3">
      <Link href="/admin/messages" className="block">
        <Card className="flex items-center gap-3 p-4 hover:bg-muted/40">
          <Mail className="size-5 text-primary" />
          <div className="flex-1">
            <p className="text-[13px] font-medium">Unread messages</p>
            <p className="text-xs text-muted-foreground">Customer enquiries awaiting a reply</p>
          </div>
          <span className="text-2xl font-semibold tabular-nums">{unread}</span>
        </Card>
      </Link>
      <Card className="p-4">
        <div className="flex items-center gap-2 text-[13px] font-medium"><Zap className="size-4 text-amber-500" /> Flash sale</div>
        {flash ? (
          <div className="mt-2 space-y-1 text-[13px]">
            <p className="font-medium">{flash.title} <Badge tone="green">Live</Badge></p>
            <p className="text-xs text-muted-foreground">{flash.discountPct}% off · {flash.productIds.filter((id) => products.some((p) => p.id === id)).length} products</p>
            <p className="text-xs text-muted-foreground">Ends {new Date(flash.endsAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">No flash sale is live. <Link href="/admin/flash-sales" className="text-primary">Create one</Link></p>
        )}
      </Card>
    </div>
  )
}
