'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Banner } from '@/data/site'

const INTERVAL = 5500

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = banners.length
  const i = idx % count
  const b = banners[i]

  useEffect(() => {
    if (count < 2 || paused) return
    const t = setTimeout(() => setIdx((x) => (x + 1) % count), INTERVAL)
    return () => clearTimeout(t)
  }, [idx, count, paused])

  return (
    <section className="mx-auto max-w-[88rem] px-5 pb-6 pt-8 lg:px-10 lg:pt-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-foreground sm:aspect-[16/9] lg:aspect-[21/9]">
        <AnimatePresence initial={false}>
          <motion.div
            key={b.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          >
            {b.image && (
              <motion.img
                src={b.image}
                alt={b.title}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: INTERVAL / 1000 + 1.5, ease: 'easeOut' }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 text-background sm:p-10 lg:p-14">
              {b.subtitle && (
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="label-mono flex items-center gap-3 text-background/80">
                  <span className="h-px w-10 bg-accent" /> {b.subtitle}
                </motion.p>
              )}
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-display max-w-4xl text-[clamp(3rem,9vw,8rem)]">
                {b.title}
              </motion.h1>
              {b.ctaLabel && b.ctaLink && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
                  <Button to={b.ctaLink} size="lg" variant="accent">{b.ctaLabel} <ArrowUpRight size={18} /></Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {count > 1 && (
          <div className="absolute bottom-5 right-5 z-10 flex gap-2 sm:bottom-8 sm:right-8">
            {banners.map((x, k) => (
              <button key={x.id} aria-label={`Show banner ${k + 1}`} onClick={() => setIdx(k)} className={cn('h-1.5 rounded-full bg-background transition-all duration-500', k === i ? 'w-10 opacity-100' : 'w-4 opacity-50 hover:opacity-80')} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
