'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { settings } from '@/data/site'
import { saveSettings } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Btn, Input } from '@/components/cms/ui'
import useDraft from '../_hooks/useDraft'
import { validateAnnouncements } from '../_utils/settings.utils'
import SectionShell from './SectionShell'

export default function AnnouncementSection() {
  const { toast } = useStore()
  const { draft: list, setDraft, dirty, reset, submitted, setSubmitted } = useDraft<string[]>(settings.announcements)
  const errors = validateAnnouncements(list)
  const edit = (i: number, v: string) => setDraft((l) => l.map((x, idx) => (idx === i ? v : x)))
  const move = (i: number, dir: -1 | 1) => setDraft((l) => {
    const n = [...l]
    const j = i + dir
    if (j < 0 || j >= n.length) return l
    ;[n[i], n[j]] = [n[j], n[i]]
    return n
  })
  const save = () => {
    setSubmitted(true)
    if (errors.list) return
    saveSettings({ announcements: list.map((x) => x.trim()) })
    setSubmitted(false)
    toast('Announcement bar saved')
  }
  return (
    <SectionShell title="Announcement bar" description="Messages scrolling in the storefront header, in this order." dirty={dirty} onSave={save} onReset={reset}>
      <ul className="grid gap-2">
        {list.map((m, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-5 text-right text-xs text-muted-foreground">{i + 1}</span>
            <Input value={m} onChange={(e) => edit(i, e.target.value)} />
            <Btn size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="size-4" /></Btn>
            <Btn size="icon" variant="ghost" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}><ArrowDown className="size-4" /></Btn>
            <Btn size="icon" variant="ghost" aria-label="Remove" onClick={() => setDraft((l) => l.filter((_, idx) => idx !== i))}><Trash2 className="size-4 text-red-600" /></Btn>
          </li>
        ))}
        {list.length === 0 && <li className="text-xs text-muted-foreground">No messages. The announcement bar will be hidden or use defaults.</li>}
      </ul>
      {submitted && errors.list && <p className="text-xs text-red-600">{errors.list}</p>}
      <div><Btn onClick={() => setDraft((l) => [...l, ''])}><Plus className="size-4" />Add message</Btn></div>
    </SectionShell>
  )
}
