'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHeroImages } from '@/app/(store)/_services/home.api'
import { NEURAL_EDGES, NEURAL_LAYOUT, NEURAL_QA, NEURAL_RING1 } from '@/app/(store)/_constants/home.constants'

const INTERVAL = 7500
const OUT = [0.16, 1, 0.3, 1] as const // ease-out expo: fast burst from the core, slow settle
type Pt = { x: number; y: number }

/** Neural network that blooms from a glowing core outward. Fills its positioned ancestor. */
export default function HeroNeural() {
  const reduce = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [open, setOpen] = useState(false)
  const { hero } = getHeroImages()
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const layout = wide ? NEURAL_LAYOUT.lg : NEURAL_LAYOUT.sm

  const pts = useMemo(() => {
    const m = new Map<string, Pt>()
    m.set('core', { x: (layout.core.x / 100) * w, y: (layout.core.y / 100) * h })
    Object.entries(layout.nodes).forEach(([id, p]) => m.set(id, { x: (p.x / 100) * w, y: (p.y / 100) * h }))
    return m
  }, [layout, w, h])

  const core = pts.get('core')!
  const current = NEURAL_QA[active]
  const cp = pts.get(current.id)!

  // Answer bubble sits just outside its question, clamped inside the stage.
  const cardW = Math.min(304, Math.max(220, w - 32))
  const cardH = 150
  const dirX = cp.x >= core.x ? 1 : -1
  const dirY = cp.y >= core.y ? 1 : -1
  let ax = wide ? cp.x - dirX * 210 : w / 2
  let ay = wide ? cp.y + (dirY > 0 ? -80 : 80) : cp.y + (dirY > 0 ? -118 : 118)
  ax = Math.min(w - cardW / 2 - 12, Math.max(cardW / 2 + 12, ax))
  ay = Math.min(h - cardH / 2 - 12, Math.max(cardH / 2 + 12, ay))

  // Kick off the bloom once measured, with the core appearing first.
  useEffect(() => {
    if (w === 0) return
    const t = setTimeout(() => setOpen(true), 150)
    return () => clearTimeout(t)
  }, [w === 0])

  const next = useCallback(() => setActive((i) => (i + 1) % NEURAL_QA.length), [])
  useEffect(() => {
    if (!open || paused || reduce) return
    const t = setTimeout(next, INTERVAL)
    return () => clearTimeout(t)
  }, [open, active, paused, reduce, next])

  const delayOf = (id: string, base = 0) => (reduce ? 0 : base + (NEURAL_RING1.includes(id) ? 0.9 : 1.9) + (id.length * 0.037) % 0.5)
  const coreR = wide ? 92 : 50

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden lg:overflow-visible" aria-label="Interactive questions and answers about shopping with us">
      {w > 0 && open && (
        <>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" width={w} height={h} aria-hidden>
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {/* expanding shock-rings from the core */}
            {!reduce && [0, 1, 2].map((i) => (
              <motion.circle key={i} cx={core.x} cy={core.y} fill="none" stroke="var(--accent)" strokeWidth={1}
                initial={{ r: coreR, opacity: 0.5 }} animate={{ r: coreR + (wide ? 420 : 240), opacity: 0 }}
                transition={{ duration: 5, delay: i * 1.7, repeat: Infinity, ease: 'easeOut' }} />
            ))}
            {NEURAL_EDGES.map(([a, b]) => {
              const p = pts.get(a), q = pts.get(b)
              if (!p || !q) return null
              const on = current.id === a || current.id === b
              const outer = !NEURAL_RING1.includes(b) && a !== 'core'
              return (
                <motion.line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                  className={cn('transition-[stroke] duration-500', on ? 'stroke-[#ff6a4d]' : 'stroke-[#8fd3ad]')}
                  strokeWidth={on ? 1.8 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: on ? 0.95 : outer ? 0.22 : 0.38 }}
                  transition={{ pathLength: { duration: reduce ? 0 : 1.3, delay: delayOf(b, -0.2), ease: OUT }, opacity: { duration: 0.5, delay: delayOf(b, -0.2) } }} />
              )
            })}
            {/* answer link */}
            <motion.line key={'ans' + current.id} x1={cp.x} y1={cp.y} x2={ax} y2={ay} stroke="#ff6a4d" strokeWidth={2} strokeDasharray="2 5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }} />
            {/* signals travelling outward from the core */}
            {!reduce && NEURAL_EDGES.filter(([a]) => a === 'core').map(([, b], i) => {
              const q = pts.get(b)!
              const strong = b === current.id
              return (
                <motion.circle key={b + (strong ? 's' : '')} r={strong ? 4.5 : 2.5} fill={strong ? '#ff6a4d' : '#8fd3ad'} filter={strong ? 'url(#glow)' : undefined}
                  initial={{ cx: core.x, cy: core.y, opacity: 0 }}
                  animate={{ cx: [core.x, q.x], cy: [core.y, q.y], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: strong ? 1.6 : 2.6, delay: 2.4 + i * 0.55, repeat: Infinity, repeatDelay: strong ? 0.2 : 3.4, ease: OUT }} />
              )
            })}
          </svg>

          {/* outer-ring dendrites */}
          {Object.keys(layout.nodes).filter((id) => id.startsWith('d')).map((id, i) => {
            const p = pts.get(id)!
            return (
              <motion.span key={id} aria-hidden className="pointer-events-none absolute -ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full border border-[#8fd3ad]/70 bg-[#07110c]"
                style={{ left: p.x, top: p.y }}
                initial={{ x: core.x - p.x, y: core.y - p.y, scale: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: NEURAL_RING1.includes(id) ? 1 : 0.55 }}
                transition={{ duration: reduce ? 0 : 1.4, delay: delayOf(id), ease: OUT }}>
                {!reduce && <motion.span className="absolute inset-0 rounded-full bg-[#8fd3ad]" animate={{ scale: [1, 2.6], opacity: [0.5, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: 3 + i * 0.4 }} />}
              </motion.span>
            )
          })}

          {/* the core */}
          <motion.div aria-hidden className="pointer-events-none absolute" style={{ left: core.x, top: core.y, width: coreR * 2, height: coreR * 2, marginLeft: -coreR, marginTop: -coreR }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: reduce ? 0 : 1.2, ease: OUT }}>
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,106,77,0.45),transparent_65%)]" />
            <motion.div className="absolute -inset-3 rounded-full border border-dashed border-[#ff6a4d]/60" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="absolute -inset-7 rounded-full border border-[#8fd3ad]/25" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }} />
            <img src={hero} alt="" className="h-full w-full rounded-full border-2 border-[#ff6a4d] object-cover shadow-[0_0_60px_rgba(255,106,77,0.5)]" />
            <div className="absolute inset-0 rounded-full bg-[#07110c]/25" />
          </motion.div>

          {/* question neurons */}
          {NEURAL_QA.map((n, i) => {
            const p = pts.get(n.id)!
            const on = i === active
            return (
              <motion.div key={n.id} className="absolute z-[3]" style={{ left: p.x, top: p.y }}
                initial={{ x: core.x - p.x, y: core.y - p.y, scale: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1.5, delay: delayOf(n.id), ease: OUT }}>
                <motion.button
                  type="button"
                  aria-pressed={on}
                  onClick={() => { setActive(i); setPaused(true) }}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  animate={reduce ? undefined : { y: [0, -6, 0], x: [0, i % 2 ? 4 : -4, 0] }}
                  transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    '-translate-x-1/2 -translate-y-1/2 flex max-w-[10.5rem] cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-left text-[0.78rem] font-medium leading-tight backdrop-blur-md transition-colors duration-300 sm:max-w-[12rem] sm:text-sm',
                    on ? 'border-[#ff6a4d] bg-[#ff6a4d] text-[#1a0d09] shadow-[0_0_0_6px_rgba(255,106,77,0.2),0_0_36px_rgba(255,106,77,0.55)]' : 'border-[#8fd3ad]/40 bg-[#0e1c15]/70 text-[#ece6d8] hover:border-[#ff6a4d]',
                  )}
                >
                  <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[0.65rem]', on ? 'bg-[#1a0d09]/20' : 'bg-[#8fd3ad]/20 text-[#8fd3ad]')}>?</span>
                  {n.q}
                </motion.button>
              </motion.div>
            )
          })}

          {/* answer neuron */}
          <div className="pointer-events-none absolute z-[5]" style={{ left: ax, top: ay, width: cardW, marginLeft: -cardW / 2, marginTop: -cardH / 2 }} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={current.id}
                initial={{ opacity: 0, scale: 0.7, y: dirY * 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.05, ease: OUT }}
                className="pointer-events-auto rounded-2xl border border-[#8fd3ad]/40 bg-[#0b1611]/85 p-4 text-[#ece6d8] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <p className="label-mono mb-2 flex items-center gap-2 text-[#8fd3ad]"><span className="h-1.5 w-1.5 rounded-full bg-[#ff6a4d]" /> {current.tag} · answer</p>
                <p className="text-[0.82rem] leading-relaxed text-[#ece6d8]/90">
                  {current.a.split(' ').map((word, k) => (
                    <motion.span key={k} className="inline-block pr-[0.28em]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.3 + k * 0.03 }}>{word}</motion.span>
                  ))}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {NEURAL_QA.map((n, i) => (
                      <button key={n.id} type="button" aria-label={`Show answer ${i + 1}`} onClick={() => { setActive(i); setPaused(true) }} className="h-1 w-5 overflow-hidden rounded-full bg-[#ece6d8]/20">
                        <motion.span key={i === active ? `a${active}${paused}` : n.id} className="block h-full bg-[#ff6a4d]"
                          initial={{ width: i < active ? '100%' : '0%' }} animate={{ width: i <= active ? '100%' : '0%' }}
                          transition={{ duration: i === active && !paused && !reduce ? INTERVAL / 1000 : 0.3, ease: 'linear' }} />
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={next} className="label-mono flex items-center gap-1 text-[#ece6d8]/60 transition-colors hover:text-[#ece6d8]">Next <ArrowRight size={12} /></button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}
