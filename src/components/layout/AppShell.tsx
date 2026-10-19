'use client'

import type { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import Background from '@/components/layout/Background'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSheet from '@/components/common/CartSheet'
import AuthSheet from '@/components/common/AuthSheet'
import PageTransition from '@/components/layout/PageTransition'

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      <Background />
      <Header />
      <main className="min-h-[70vh]">
        <AnimatePresence mode="wait" initial>
          <PageTransition key={pathname}>{children}</PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <CartSheet />
      <AuthSheet />
    </>
  )
}
