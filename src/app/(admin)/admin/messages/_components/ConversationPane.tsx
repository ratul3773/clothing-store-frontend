'use client'

import { useState } from 'react'
import { CheckCircle2, Mail, Phone, RotateCcw, Trash2 } from 'lucide-react'
import { deleteMessage, patchMessage, type Message } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { ConfirmDialog } from '@/components/cms/Modal'
import { Badge, Btn, Empty, Field, Textarea } from '@/components/cms/ui'
import { fmtDateTime, statusTone } from '@/app/(admin)/admin/messages/_utils/messages.utils'

export default function ConversationPane({ message: m, onDeleted }: { message: Message | undefined; onDeleted: () => void }) {
  const { toast } = useStore()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)

  if (!m) return <Empty title="Select a message" description="Choose a conversation from the inbox to read and reply." />

  const send = () => {
    if (!text.trim()) return setError('Write a reply first')
    setError('')
    patchMessage(m.id, { replies: [...m.replies, { text: text.trim(), at: new Date().toISOString() }], status: 'open' })
    setText('')
    toast('Reply added')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border p-4">
        <div>
          <h2 className="text-sm font-semibold">{m.subject}</h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{m.name}</span>
            {m.phone && <a className="inline-flex items-center gap-1 text-primary hover:underline" href={`tel:${m.phone.replace(/\s+/g, '')}`}><Phone className="size-3" />{m.phone}</a>}
            {m.email && <a className="inline-flex items-center gap-1 text-primary hover:underline" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}><Mail className="size-3" />{m.email}</a>}
            <Badge tone={statusTone[m.status]} className="capitalize">{m.status}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          {m.status === 'resolved' ? (
            <Btn onClick={() => { patchMessage(m.id, { status: 'open' }); toast('Conversation reopened') }}><RotateCcw className="size-4" />Reopen</Btn>
          ) : (
            <Btn onClick={() => { patchMessage(m.id, { status: 'resolved' }); toast('Marked as resolved') }}><CheckCircle2 className="size-4" />Mark resolved</Btn>
          )}
          <Btn variant="dangerOutline" onClick={() => setConfirm(true)}><Trash2 className="size-4" />Delete</Btn>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
        <div className="max-w-[85%] rounded-lg border border-border bg-card p-3 text-[13px]">
          <p className="mb-1 text-[11px] text-muted-foreground">{m.name} · {fmtDateTime(m.createdAt)}</p>
          <p className="whitespace-pre-wrap">{m.body}</p>
        </div>
        {m.replies.map((r, i) => (
          <div key={i} className="ml-auto max-w-[85%] rounded-lg bg-primary/10 p-3 text-[13px]">
            <p className="mb-1 text-[11px] text-muted-foreground">Staff · {fmtDateTime(r.at)}</p>
            <p className="whitespace-pre-wrap">{r.text}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-border p-4">
        <Field label="Reply" error={error}>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your reply" />
        </Field>
        <Btn variant="primary" onClick={send}>Send reply</Btn>
      </div>
      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Delete message?" description="This conversation and its replies will be permanently removed." onConfirm={() => { deleteMessage(m.id); toast('Message deleted'); onDeleted() }} />
    </div>
  )
}
