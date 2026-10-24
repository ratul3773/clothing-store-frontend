import { Suspense, type ReactNode } from 'react'
import Shell from '@/components/layout/AppShell'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>
}
