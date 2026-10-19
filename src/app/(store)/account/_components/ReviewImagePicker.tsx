'use client'

import { ImagePlus, X } from 'lucide-react'
import { MAX_REVIEW_IMAGES } from '@/data/reviews'

type Props = { images: string[]; onAdd: (f: FileList | null) => void; onRemove: (i: number) => void }

export default function ReviewImagePicker({ images, onAdd, onRemove }: Props) {
  return (
    <div>
      <span className="label-mono mb-1.5 block text-muted-foreground">Photos ({images.length}/{MAX_REVIEW_IMAGES})</span>
      <div className="flex gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} alt={`Upload ${i + 1}`} className="h-24 w-[4.8rem] rounded-[2px] object-cover" />
            <button type="button" onClick={() => onRemove(i)} aria-label="Remove photo" className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-foreground text-background transition hover:bg-accent"><X size={15} /></button>
          </div>
        ))}
        {images.length < MAX_REVIEW_IMAGES && (
          <label className="grid h-24 w-[4.8rem] cursor-pointer place-items-center rounded-[2px] border border-dashed border-foreground/50 text-muted-foreground transition hover:border-accent hover:text-accent">
            <ImagePlus size={22} />
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { onAdd(e.target.files); e.target.value = '' }} />
          </label>
        )}
      </div>
    </div>
  )
}
