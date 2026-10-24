'use client'

import { useContext, useEffect, useRef, type ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { usePathname } from 'next/navigation'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

function Frozen({ children }: { children: ReactNode }) {
  const ctx = useContext(LayoutRouterContext)
  const frozen = useRef(ctx).current
  return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>
}

const ease = [0.76, 0, 0.24, 1] as const

const layer = (delay: number): Variants => ({
  initial: { scaleY: 1, transformOrigin: 'top' },
  animate: { scaleY: 0, transformOrigin: 'top', transition: { duration: 0.5, ease, delay } },
  exit: { scaleY: 1, transformOrigin: 'bottom', transition: { duration: 0.55, ease, delay: 0.1 - delay } },
})

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <motion.div initial="initial" animate="animate" exit="exit">
      <motion.div variants={layer(0.12)} className="pointer-events-none fixed inset-0 z-[150] bg-accent" />
      <motion.div variants={layer(0)} className="pointer-events-none fixed inset-0 z-[151] bg-foreground">
        <motion.span
          variants={{ initial: { opacity: 1 }, animate: { opacity: 0, transition: { duration: 0.3 } }, exit: { opacity: 1, transition: { delay: 0.1 } } }}
          className="font-display absolute bottom-8 left-8 text-6xl text-background/90"
        >
          Mohallah &amp; Co.
        </motion.span>
      </motion.div>
      <motion.div
        variants={{ initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.1, ease: 'easeOut' } }, exit: { opacity: 1 } }}
      >
        <Frozen>{children}</Frozen>
      </motion.div>
    </motion.div>
  )
}
