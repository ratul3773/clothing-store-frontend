'use client'

import { fmtDateTime, statusTone } from '@/app/(admin)/admin/messages/_utils/messages.utils'
import { Badge, Btn, Empty } from '@/components/cms/ui'
import AlertDialogText from '@/components/common/Alert-Dialogue'
import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { deleteMessage, patchMessage, type Message } from '@/data/cms'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail, Phone, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { replySchema } from '../_schemas/reply.schema'

export default function ConversationPane({ message: m, onDeleted }: { message: Message | undefined; onDeleted: () => void }) {
  const { toast } = useStore()
  const form = useForm({ resolver: zodResolver(replySchema), defaultValues: { text: '' } })
  const [confirm, setConfirm] = useState(false)

  if (!m) return <Empty title="Select a message" description="Choose a conversation from the inbox to read and reply." />

  const send = form.handleSubmit(({ text }) => {
    patchMessage(m.id, { replies: [...m.replies, { text, at: new Date().toISOString() }], status: 'open' })
    form.reset()
    toast('Reply added')
  })

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
      <form onSubmit={send} noValidate className="space-y-2 border-t border-border p-4">
        <FormField form={form} id="message-reply" name="text" isAdmin isTextArea label="Reply" placeholder="Type your reply" />
        <Btn type="submit" variant="primary">Send reply</Btn>
      </form>
      <AlertDialogText mode="normal" open={confirm} onOpenChange={setConfirm} title="Delete message?" description="This conversation and its replies will be permanently removed." actionType="delete" onConfirm={() => { deleteMessage(m.id); toast('Message deleted'); onDeleted() }} />
    </div>
  )
}
