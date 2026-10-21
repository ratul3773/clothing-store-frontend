'use client'

import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { readImage } from '@/app/(store)/account/_utils/account.utils'
import { Btn, Input } from '@/components/cms/ui'

type Props = { value: string; onChange: (v: string) => void; placeholder?: string }

/** Image URL input with local-file upload (stored as data URL in memory). */
export default function ImageField({ value, onChange, placeholder = 'https://…' }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="flex items-center gap-2">
      <div className="size-10 shrink-0 overflow-hidden rounded border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value && <img src={value} alt="" className="size-full object-cover" />}
      </div>
      <Input value={value.startsWith('data:') ? 'Uploaded image' : value} readOnly={value.startsWith('data:')} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      <input ref={ref} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await readImage(f)); e.target.value = '' }} />
      <Btn size="icon" aria-label="Upload image" onClick={() => ref.current?.click()}><ImagePlus className="size-4" /></Btn>
      {value && <Btn size="icon" variant="ghost" aria-label="Clear image" onClick={() => onChange('')}><X className="size-4" /></Btn>}
    </div>
  )
}
