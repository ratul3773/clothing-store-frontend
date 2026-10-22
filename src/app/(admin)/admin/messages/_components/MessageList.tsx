'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import usePagination from '@/lib/usePagination'
import { cn } from '@/lib/utils'
import { Badge, Btn, Empty } from '@/components/cms/ui'
import type { Message } from '@/data/cms'
import { PAGE_SIZE } from '@/app/(admin)/admin/messages/_constants/messages.constants'
import { fmtDateTime, statusTone } from '@/app/(admin)/admin/messages/_utils/messages.utils'

export default function MessageList({ rows, activeId, onSelect, resetKey }: { rows: Message[]; activeId: string | null; onSelect: (id: string) => void; resetKey: string }) {
  const { page, setPage, pageCount, pageItems, total } = usePagination(rows, PAGE_SIZE, resetKey)
  if (total === 0) return <Empty title="No messages" description="Nothing matches this view." />
  return (
    <div>
      <ul>
        {pageItems.map((m) => {
          const unread = m.status === 'new'
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                className={cn('block w-full border-b border-border px-3 py-2.5 text-left hover:bg-muted/50', activeId === m.id && 'bg-primary/5')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('truncate text-[13px]', unread ? 'font-bold' : 'font-medium')}>{m.name}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{fmtDateTime(m.createdAt)}</span>
                </div>
                <p className={cn('truncate text-[13px]', unread ? 'font-semibold' : 'text-foreground/80')}>{m.subject}</p>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground">{m.body}</span>
                  <Badge tone={statusTone[m.status]} className="capitalize">{m.status}</Badge>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
        <span>{total} messages</span>
        <div className="flex items-center gap-1">
          <Btn size="icon" className="size-7" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></Btn>
          <span className="px-1">{page} / {pageCount}</span>
          <Btn size="icon" className="size-7" disabled={page >= pageCount} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight className="size-4" /></Btn>
        </div>
      </div>
    </div>
  )
}
