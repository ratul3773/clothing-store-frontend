"use client"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import PageTransition from '@/components/layout/PageTransition'
import { AnimatePresence } from "motion/react"

export default function AnimatedTransit({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait" initial>
      <PageTransition key={pathname}>{children}</PageTransition>
    </AnimatePresence>
  )
}