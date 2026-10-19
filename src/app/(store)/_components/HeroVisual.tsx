'use client'

import { motion, type MotionValue } from 'motion/react'
import { getHeroImages } from '@/app/(store)/_services/home.api'

export default function HeroVisual({ y, rot }: { y: MotionValue<number>; rot: MotionValue<number> }) {
  const { hero, heroAlt } = getHeroImages()
  return (
    <motion.div style={{ y }} className="relative mx-auto w-full max-w-md lg:max-w-none">
      <motion.div initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1.2, delay: 0.6, ease: [0.76, 0, 0.24, 1] }} className="aspect-[4/5] overflow-hidden rounded-[3px] bg-muted">
        <img src={hero} alt="Man in a relaxed casual shirt" className="h-full w-full object-cover" />
      </motion.div>
      <motion.img
        src={heroAlt}
        alt="Slim chino trousers detail"
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -4 }}
        transition={{ delay: 1.5, type: 'spring' }}
        className="absolute -bottom-8 -left-6 hidden w-40 rounded-[3px] border-4 border-background object-cover shadow-2xl sm:block"
        style={{ aspectRatio: '4/5' }}
      />
      <motion.div style={{ rotate: rot }} className="absolute -right-4 top-6 grid h-28 w-28 place-items-center rounded-full bg-accent p-3 text-center text-accent-foreground pulse-ring sm:-right-8 sm:h-32 sm:w-32">
        <span className="label-mono leading-snug">Cash on<br />delivery<br />✦ BD ✦</span>
      </motion.div>
    </motion.div>
  )
}
