'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/common/Reveal'
import HeroVisual from '@/app/(store)/_components/HeroVisual'
import { HERO_WORDS } from '@/app/(store)/_constants/home.constants'

export default function HeroClassic() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const rot = useTransform(scrollYProgress, [0, 1], [0, 160])

  return (
    <section ref={ref} className="relative grid items-center gap-8 pb-16 pt-10 lg:grid-cols-[1.25fr_1fr] lg:pt-16">
      <div className="relative z-10">
        <p className="label-mono mb-6 flex items-center gap-3"><span className="h-px w-10 bg-accent" /> Men's shirts &amp; pants · Dhaka</p>
        <h1 className="font-display text-5xl sm:text-8xl">
          {HERO_WORDS.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${i === 2 ? 'text-accent' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <Reveal delay={0.9} className="mt-8 max-w-md">
          <p className="text-lg leading-relaxed text-foreground/80">
            Cut for hot afternoons and long commutes. Pick your size and colour, order as a guest, pay on delivery. No WhatsApp back-and-forth.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/shop" size="lg" variant="accent">Shop the collection <ArrowUpRight size={18} /></Button>
            <Button to="/shop?offers=1" size="lg" variant="outline">See offers</Button>
          </div>
        </Reveal>
      </div>
      <HeroVisual y={y} rot={rot} />
    </section>
  )
}
