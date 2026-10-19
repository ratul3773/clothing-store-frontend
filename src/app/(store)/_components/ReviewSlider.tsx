'use client'

import { useMemo } from 'react'
import { BadgeCheck, CornerDownRight } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import StarRating from '@/components/common/StarRating'
import { useStore } from '@/components/providers/StoreProvider'
import { useCms } from '@/lib/useCms'
import { findVisible, visibleReviews } from '@/lib/storefront'

export default function ReviewSlider() {
  const v = useCms()
  const { reviews } = useStore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => visibleReviews(reviews).filter((r) => r.rating >= 4 && findVisible(r.productId)).slice(0, 12), [reviews, v])
  if (list.length === 0) return null
  const track = [...list, ...list]

  return (
    <section className="mt-28">
      <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
        <Reveal><h2 className="font-display text-[clamp(3rem,7vw,6rem)]">Verified <span className="text-accent">fit</span> notes</h2></Reveal>
      </div>
      <div className="marquee-pause mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-rtl flex w-max gap-4 px-2">
          {track.map((r, i) => (
            <figure key={`${r.id}-${i}`} aria-hidden={i >= list.length} className="flex w-[22rem] shrink-0 flex-col rounded-[3px] border border-border bg-card/70 p-6 transition hover:-translate-y-1.5 hover:shadow-xl">
              <div className="mb-4 flex items-center justify-between"><StarRating value={r.rating} /><span className="label-mono flex items-center gap-1 text-moss"><BadgeCheck size={13} /> Verified</span></div>
              <blockquote className="line-clamp-4 text-lg leading-snug">“{r.text}”</blockquote>
              {r.images[0] && <img src={r.images[0]} alt="" className="mt-4 h-16 w-14 rounded-[2px] object-cover" />}
              {r.reply && <p className="mt-4 flex gap-2 text-xs text-muted-foreground"><CornerDownRight size={13} className="shrink-0 text-accent" /><span className="line-clamp-2">{r.reply.text}</span></p>}
              <figcaption className="label-mono mt-auto pt-5 text-muted-foreground">{r.author} · {findVisible(r.productId)?.name} · Fit: {r.fit}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
