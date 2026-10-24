'use client'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheeet'
import { Choice } from '@/components/ui/controls'
import { Field, inputCls } from '@/components/common/FormField'
import StarRating from '@/components/common/StarRating'
import ReviewImagePicker from '@/app/(store)/account/_components/ReviewImagePicker'
import { FIT_OPTIONS, type Fit } from '@/data/reviews'
import type useReviewForm from '@/app/(store)/account/_hooks/useReviewForm'

export default function ReviewFormSheet({ f }: { f: ReturnType<typeof useReviewForm> }) {
  const t = f.target
  return (
    <Sheet open={!!t} onOpenChange={(b) => !b && f.close()} title="Write a review" description="Share how it wears. Add up to 3 photos." side="center">
      {t && (
        <div className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
          <div className="flex items-center gap-3">
            <img src={t.item.image} alt="" className="h-16 w-12 rounded-[2px] object-cover" />
            <div><p className="font-semibold">{t.item.name}</p><p className="label-mono text-muted-foreground">{t.order.id} · {[t.item.color, t.item.size].filter(Boolean).join(' · ')}</p></div>
          </div>
          <Field label="Rating"><StarRating value={f.rating} onChange={f.setRating} size={28} /></Field>
          <Field label="How did it fit?">
            <Choice value={f.fit} onChange={(v) => f.setFit(v as Fit)} options={FIT_OPTIONS.map((o) => ({ value: o, title: o }))} className="grid grid-cols-3 gap-2" />
          </Field>
          <Field label="Your review"><textarea className={`${inputCls} h-28 resize-none py-3`} value={f.text} onChange={(e) => f.setText(e.target.value)} placeholder="Fabric, fit, delivery…" maxLength={500} /></Field>
          <ReviewImagePicker images={f.images} onAdd={f.addFiles} onRemove={f.removeImage} />
          {f.err && <p role="alert" className="text-sm text-accent">{f.err}</p>}
          <Button className="w-full" size="lg" variant="accent" onClick={f.submit}>Post review</Button>
        </div>
      )}
    </Sheet>
  )
}
