'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { messages, patchMessage } from '@/data/cms'
import { useCms } from '@/lib/useCms'
import { cn } from '@/lib/utils'
import { Card, Input, PageHeader } from '@/components/cms/ui'
import { TABS, type Tab } from '@/app/(admin)/admin/messages/_constants/messages.constants'
import { filterMessages } from '@/app/(admin)/admin/messages/_utils/messages.utils'
import MessageList from '@/app/(admin)/admin/messages/_components/MessageList'
import ConversationPane from '@/app/(admin)/admin/messages/_components/ConversationPane'

export default function MessagesInbox() {
  const version = useCms()
  const [tab, setTab] = useState<Tab>('all')
  const [q, setQ] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const rows = useMemo(() => filterMessages(messages, tab, q), [tab, q, version]) // eslint-disable-line react-hooks/exhaustive-deps
  const count = (t: Tab) => (t === 'all' ? messages.length : messages.filter((m) => m.status === t).length)
  const active = messages.find((m) => m.id === activeId)

  const select = (id: string) => {
    setActiveId(id)
    const m = messages.find((x) => x.id === id)
    if (m?.status === 'new') patchMessage(id, { status: 'open' })
  }

  return (
    <>
      <PageHeader title="Messages" description="Contact form inbox from the storefront." crumbs={['Admin', 'Messages']} />
      <Card className="grid min-h-[34rem] overflow-hidden lg:grid-cols-[22rem_1fr]">
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="flex gap-1 border-b border-border p-2">
            {TABS.map((t) => (
              <button key={t.value} type="button" onClick={() => setTab(t.value)} className={cn('rounded px-2 py-1 text-xs font-medium', tab === t.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
                {t.label} ({count(t.value)})
              </button>
            ))}
          </div>
          <div className="relative border-b border-border p-2">
            <Search className="pointer-events-none absolute left-4 top-4 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search messages" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <MessageList rows={rows} activeId={activeId} onSelect={select} resetKey={`${tab}|${q}`} />
        </div>
        <ConversationPane key={activeId ?? 'none'} message={active} onDeleted={() => setActiveId(null)} />
      </Card>
    </>
  )
}
