'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { activeFlash, type Product } from '@/data/catalog'
import { useCms } from '@/lib/useCms'

interface Props { p: Product; color: Product['colors'][number]; onSelect: (i: number) => void }

export default function ProductGallery({ p, color, onSelect }: Props) {
  useCms()
  const flash = activeFlash(p)
  const [selection, setSelection] = useState({ colorImage: color.image, image: color.image >= 0 ? color.image : 0 })
  const selectedImage = selection.colorImage === color.image
    ? selection.image
    : color.image >= 0
      ? color.image
      : 0

  const main = p.images[selectedImage] ?? p.images[0]
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-4">
      <div className="space-y-3">
        {p.images.map((im, i) => (
          <button key={i} onClick={() => {
            setSelection({ colorImage: color.image, image: i })
            const colorIndex = p.colors.findIndex((candidate) => candidate.image === i)
            if (colorIndex >= 0) onSelect(colorIndex)
          }} className={cn('block aspect-[4/5] w-full overflow-hidden rounded-[2px] border-2 transition', selectedImage === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100')}>
            <img src={im} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-muted">
        <AnimatePresence mode="popLayout">
          <motion.img key={main} src={main} alt={`${p.name} in ${color.name}`} initial={{ clipPath: 'inset(0 0 100% 0)', scale: 1.1 }} animate={{ clipPath: 'inset(0 0 0% 0)', scale: 1 }} exit={{ opacity: 0.99 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
        <div className="absolute left-4 top-4 flex gap-2">{flash && <Badge className="bg-accent text-accent-foreground">{`FLASH −${flash.discountPct}%`}</Badge>}{p.badges.map((b) => <Badge key={b}>{b}</Badge>)}</div>
      </div>
    </div>
  )
}
