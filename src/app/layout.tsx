export const instant = false
import type { Metadata } from 'next'
import { Big_Shoulders, DM_Mono, Hanken_Grotesk } from 'next/font/google'
import { ThemeProvider, themeInitScript } from '@/components/providers/ThemeProvider'
import { StoreProvider } from '@/components/providers/StoreProvider'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import ReduxProvider from '@/components/providers/redux-provider'
import Script from "next/script";
import { Suspense } from 'react'
import UniversalSkeleton from '@/components/common/UniversalSkeleton'
const display = Big_Shoulders({ subsets: ['latin'], weight: ['500', '700', '800', '900'], variable: '--f-display', display: 'swap' })
const sans = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--f-sans', display: 'swap' })
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Mohallah&Co — Shirts & Pants',
  description: 'Create a visually engaging single vendor eCommerce frontend with dynamic animations and transitions, tailored for seamless user experience.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          {/* <Suspense fallback={<UniversalSkeleton />}> */}
            <ReduxProvider>
              <StoreProvider>
                <TooltipProvider>
                  {children}
                </TooltipProvider>
              </StoreProvider>
            </ReduxProvider>
          {/* </Suspense> */}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
