'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '@/components/common/Reveal'
import { cn } from '@/lib/utils'
import { HOW_STEPS } from '@/app/(store)/_constants/home.constants'
import { Button } from '@animate-ui/react/primitives/buttons/button'

export default function HowItWorks() {
  const [step, setStep] = useState(0)
  const [hover, setHover] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (hover || reduce) return
    const t = setTimeout(() => setStep((s) => (s + 1) % HOW_STEPS.length), 4500)
    return () => clearTimeout(t)
  }, [step, hover, reduce])

  const s = HOW_STEPS[step]
  return (
    <section className="mt-24" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Reveal>
        <p className="label-mono mb-4 flex items-center gap-3"><span className="h-px w-10 bg-accent" /> How it works</p>
        <h2 className="font-display text-2xl sm:text-4xl">Four taps from shelf to door</h2>
      </Reveal>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ol className="relative">
          <span aria-hidden className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-border" />
          <motion.span aria-hidden className="absolute left-[1.35rem] top-6 w-px origin-top bg-accent" style={{ height: 'calc(100% - 3rem)' }} animate={{ scaleY: step / (HOW_STEPS.length - 1) }} transition={{ duration: 0.6, ease: 'easeInOut' }} />
          {HOW_STEPS.map((h, i) => (
            <li key={h.n}>
              <Button type="button" onClick={() => setStep(i)} aria-current={i === step} className="group relative flex w-full items-center gap-5 py-4 text-left">
                <span className={cn('relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border font-mono text-xs transition-all duration-300', i <= step ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-background group-hover:border-accent', i === step && 'scale-110 pulse-ring')}>{h.n}</span>
                <span className={cn('font-display text-xl transition-all duration-300 sm:text-2xl', i === step ? 'translate-x-1 text-foreground' : 'text-foreground/40 group-hover:text-foreground/70')}>{h.title}</span>
              </Button>
            </li>
          ))}
        </ol>
        <div className="relative min-h-[18rem] overflow-hidden rounded-[3px] bg-primary p-8 text-primary-foreground sm:p-10">
          <span aria-hidden className="font-display pointer-events-none absolute bottom-0 -right-2 text-9xl leading-none opacity-10">{s.n}</span>
          <AnimatePresence mode="wait">
            <motion.div key={s.n} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="relative">
              <p className="label-mono text-primary-foreground/70">Step {s.n}</p>
              <h3 className="font-display mt-3 text-2xl sm:text-4xl">{s.title}</h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-primary-foreground/85">{s.text}</p>
              <p className="label-mono mt-8 inline-block rounded-full border border-primary-foreground/40 px-4 py-2">{s.stat}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
