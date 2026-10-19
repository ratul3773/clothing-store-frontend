import { BadgeCheck, CornerDownRight } from 'lucide-react'
import StarRating from '@/components/common/StarRating'
import { findProduct } from '@/lib/storefront'
import type { Review } from '@/data/reviews'

type Props = { r: Review; showProduct?: boolean; children?: React.ReactNode }

export default function ReviewCard({ r, showProduct, children }: Props) {
  return (
    <article className="rounded-[3px] border border-border bg-card/70 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StarRating value={r.rating} />
        <span className="label-mono flex items-center gap-1 text-moss"><BadgeCheck size={13} /> Verified purchase · Fit: {r.fit}</span>
      </div>
      {showProduct && <p className="label-mono mt-3 text-muted-foreground">{findProduct(r.productId)?.name ?? 'Removed product'}</p>}
      <p className="mt-3 leading-snug">“{r.text}”</p>
      {r.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {r.images.map((src, i) => <a key={i} href={src} target="_blank" rel="noreferrer"><img src={src} alt={`Review photo ${i + 1}`} className="h-20 w-16 rounded-[2px] object-cover transition hover:scale-105" /></a>)}
        </div>
      )}
      <p className="label-mono mt-3 text-muted-foreground">{r.author} · {new Date(r.createdAt).toLocaleDateString('en-GB')}</p>
      {r.reply && (
        <div className="mt-4 flex gap-2 rounded-[3px] bg-foreground/5 p-3 text-sm">
          <CornerDownRight size={16} className="mt-0.5 shrink-0 text-accent" />
          <div><p className="label-mono text-accent">Reply from Mohallah&amp;Co</p><p>{r.reply.text}</p></div>
        </div>
      )}
      {children}
    </article>
  )
}
