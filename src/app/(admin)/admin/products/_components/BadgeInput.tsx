'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge, Input } from '@/components/cms/ui'
import { BADGE_SUGGESTIONS } from '../_constants/products.constants'

export default function BadgeInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState('')
  const add = (raw: string) => {
    const b = raw.trim().toUpperCase()
    if (b && !value.includes(b)) onChange([...value, b])
    setText('')
  }
  return (
    <div>
      <Input
        value={text}
        placeholder="Type a badge and press Enter"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add(text)
          }
        }}
        onBlur={() => add(text)}
      />
      <div className="mt-1.5 flex flex-wrap gap-1">
        {value.map((b) => (
          <Badge key={b} tone="blue" className="gap-1">
            {b}
            <button type="button" aria-label={`Remove ${b}`} onClick={() => onChange(value.filter((x) => x !== b))}><X className="size-3" /></button>
          </Badge>
        ))}
        {BADGE_SUGGESTIONS.filter((s) => !value.includes(s)).map((s) => (
          <button key={s} type="button" onClick={() => add(s)} className="rounded border border-dashed border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted">+ {s}</button>
        ))}
      </div>
    </div>
  )
}
