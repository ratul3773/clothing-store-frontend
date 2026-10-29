'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/common/Reveal'
import HeroNeural from '@/app/(store)/_components/HeroVisual'
import { HERO_WORDS } from '@/app/(store)/_constants/home.constants'

const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 53.7) % 100,
  y: (i * 37.3 + (i % 7) * 11) % 100,
  s: 1 + (i % 3) * 0.6,
  d: 2.5 + (i % 5),
}))

export default function HeroClassic() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen isolate overflow-hidden bg-[#050a08] text-[#ece6d8]">
      {/* deep-space backdrop: nebula glows, grid and twinkling stars */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_78%_50%,rgba(228,68,43,0.22),transparent_60%),radial-gradient(50rem_36rem_at_10%_0%,rgba(47,110,80,0.35),transparent_60%),radial-gradient(40rem_30rem_at_50%_110%,rgba(31,74,56,0.5),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(#8fd3ad_1px,transparent_1px),linear-gradient(90deg,#8fd3ad_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_75%_50%,black,transparent_70%)]" />
        {STARS.map((s, i) => (
          <motion.span key={i} className="absolute rounded-full bg-[#ece6d8]" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }} animate={{ opacity: [0.15, 0.9, 0.15] }} transition={{ duration: s.d, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-330 grid min-h-[44rem] px-5 pb-6 pt-10 lg:min-h-[48rem] lg:px-10 lg:pb-16 lg:pt-16">
        {/* graph layer: fills the whole hero on desktop, a dedicated stage under the copy on mobile */}
        <div className="relative order-2 mt-8  lg:static lg:order-none lg:mt-0 lg:h-auto">
          <HeroNeural />
        </div>
        <div className="pointer-events-none relative z-10 order-1 self-center lg:absolute lg:left-10 lg:top-1/2 lg:order-none lg:max-w-[56%] lg:-translate-y-1/2">
          <p className="label-mono mb-6 flex items-center gap-3"><span className="h-px w-10 bg-accent" /> Men's shirts &amp; pants · Dhaka</p>
          <h1 className="font-display text-7xl">
            {HERO_WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 2 ? 'text-accent' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <Reveal delay={0.6} className="pointer-events-auto mt-8 max-w-md">
            <p className="text-lg leading-relaxed text-[#ece6d8]/80">
              Cut for hot afternoons and long commutes. Pick your size and colour, order as a guest, pay on delivery. No WhatsApp back-and-forth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/shop" size="lg" variant="accent">Shop the collection <ArrowUpRight size={18} /></Button>
              <Button to="/shop?offers=1" size="lg" variant="outline" className="border-[#ece6d8]/70 text-[#ece6d8] before:bg-[#ece6d8] hover:text-[#050a08]">See offers</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
