
import { Suspense, type ReactNode } from 'react'
import Background from '@/components/layout/Background'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSheet from '@/components/common/CartSheet'
import AuthSheet from '@/components/common/auth/AuthSheet'
import AnimatedTransit from './AnimatedTransit'
import ProfileButton from './Profile-button'

export default function Shell({ children }: { children: ReactNode; }) {
  return (
    <>
      <Background />
      <Header profileButton={
        <Suspense 
          fallback={<div className="hidden h-9 w-20 animate-pulse rounded bg-muted sm:block" />}
        >
          <ProfileButton/>
        </Suspense>
      } 
      />
      <main className="min-h-[70vh] max-w-330 mx-auto px-5 py-8 lg:px-10">
        <AnimatedTransit>{children}</AnimatedTransit>
      </main>
      <Footer />
      <CartSheet />
      <AuthSheet />
    </>
  )
}
