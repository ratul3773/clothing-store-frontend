'use client'

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Btn, Card, CardHeader } from '@/components/cms/ui'
import ImageField from '@/components/cms/ImageField'
import type { Color } from '@/data/catalog'
import type { SectionProps } from './sectionProps'

export default function ImagesSection({ d, patch, error }: SectionProps & { error?: string }) {
  const set = (images: string[], colors?: Color[]) => patch({ images, ...(colors ? { colors } : {}) })
  // keep color->image indexes valid after structural changes
  const remap = (fn: (i: number) => number) => d.colors.map((c) => ({ ...c, image: Math.max(0, fn(c.image)) }))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= d.images.length) return
    const next = [...d.images]
    ;[next[i], next[j]] = [next[j], next[i]]
    set(next, remap((x) => (x === i ? j : x === j ? i : x)))
  }
  const remove = (i: number) => {
    const n = d.images.length - 1
    set(d.images.filter((_, k) => k !== i), remap((x) => Math.min(x > i ? x - 1 : x === i ? 0 : x, Math.max(0, n - 1))))
  }
  return (
    <Card>
      <CardHeader title="Images" description="First image is the main thumbnail. At least one is required." actions={<Btn size="sm" onClick={() => set([...d.images, ''])}><Plus className="size-3.5" />Add image</Btn>} />
      <div className="space-y-2 p-4">
        {d.images.map((img, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs text-muted-foreground">{i + 1}</span>
            <div className="flex-1"><ImageField value={img} onChange={(v) => set(d.images.map((x, k) => (k === i ? v : x)))} /></div>
            <Btn size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="size-4" /></Btn>
            <Btn size="icon" variant="ghost" aria-label="Move down" disabled={i === d.images.length - 1} onClick={() => move(i, 1)}><ArrowDown className="size-4" /></Btn>
            <Btn size="icon" variant="ghost" aria-label="Remove image" className="text-red-600" disabled={d.images.length <= 1} onClick={() => remove(i)}><Trash2 className="size-4" /></Btn>
          </div>
        ))}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Card>
  )
}
