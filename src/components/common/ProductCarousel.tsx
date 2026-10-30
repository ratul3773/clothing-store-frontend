'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/common/ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/data/catalog'

/**
 * Swipeable product row. Native scroll-snap handles touch swipes, pointer drag handles mouse,
 * and it auto-advances (looping back to the start). Card widths are fractional so the next card always peeks in.
 */
export default function ProductCarousel({ items, interval = 4200, className }: { items: Product[]; interval?: number; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [edge, setEdge] = useState({ start: true, end: false })
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })
  const [dragging, setDragging] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  const step = useCallback((dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const by = (card?.offsetWidth ?? el.clientWidth / 2) + 16
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    else el.scrollBy({ left: dir * by, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => { io.disconnect(); ro.disconnect() }
  }, [measure, items.length])

  useEffect(() => {
    if (paused || !visible || reduce || items.length < 2) return
    const t = setInterval(() => step(1), interval)
    return () => clearInterval(t)
  }, [paused, visible, reduce, interval, items.length, step])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.down || !ref.current) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) { d.moved = true; setDragging(true); setPaused(true) }
    if (d.moved) ref.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    if (!drag.current.down) return
    drag.current.down = false
    setDragging(false)
  }

  return (
    <div className={cn('group/car relative', className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); endDrag() }} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
      <div
        ref={ref}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false } }}
        onDragStart={(e) => e.preventDefault()}
        className={cn(
          'flex gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden',
          dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory scroll-smooth lg:cursor-grab',
        )}
      >
        {items.map((p, i) => (
          <div key={p.id} className="w-[calc((100%-1rem*1.4)/2.4)] shrink-0 snap-start sm:w-[calc((100%-1rem*2.3)/3.3)] lg:w-[calc((100%-1.5rem*3.3)/4.3)]">
            <ProductCard p={p} index={i} />
          </div>
        ))}
      </div>
      {/* fade hints that more products continue off-screen */}
      {!edge.end && <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-background/60 to-transparent sm:block" />}
      <button type="button" aria-label="Previous products" onClick={() => step(-1)} className="absolute left-2 top-[38%] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-foreground opacity-0 shadow-lg transition hover:bg-accent hover:text-accent-foreground group-hover/car:opacity-100 md:grid"><ChevronLeft size={20} /></button>
      <button type="button" aria-label="Next products" onClick={() => step(1)} className="absolute right-2 top-[38%] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-foreground opacity-0 shadow-lg transition hover:bg-accent hover:text-accent-foreground group-hover/car:opacity-100 md:grid"><ChevronRight size={20} /></button>
    </div>
  )
}
