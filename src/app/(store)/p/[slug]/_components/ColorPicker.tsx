'use client'

import { Tip } from '@/components/ui/controls'
import { cn } from '@/lib/utils'
import type { Product } from '@/data/catalog'

interface Props { colors: Product['colors']; index: number; onSelect: (i: number) => void }

export default function ColorPicker({ colors, index, onSelect }: Props) {
  return (
    <div className="mt-8">
      <p className="label-mono mb-3">Colour — <span className="text-muted-foreground">{colors[index].name}</span></p>
      <div className="flex gap-3">
        {colors.map((c, i) => (
          <Tip key={c.name} label={c.name}>
            <button aria-label={c.name} onClick={() => onSelect(i)} className={cn('relative h-8 w-8 rounded-full border border-foreground/40 transition hover:scale-110', index === i && 'ring-2 ring-accent ring-offset-2 ring-offset-background')} style={{ background: c.hex }} />
          </Tip>
        ))}
      </div>
    </div>
  )
}
