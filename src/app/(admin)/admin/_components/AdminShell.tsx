'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, LogOut, Menu, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'
import ThemeToggle from '@/components/common/ThemeToggle'
import { Btn } from '@/components/cms/ui'
import { NAV } from '@/app/(admin)/admin/_constants/nav.constants'
import AdminLogin from '@/app/(admin)/admin/_components/AdminLogin'

const KEY = 'cms-auth'

export default function AdminShell({ children }: { children: ReactNode }) {
  useCms()
  const pathname = usePathname().replace(/\/$/, '') || '/admin'
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setAuthed(sessionStorage.getItem(KEY) === '1')
    setReady(true)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))
  const current = NAV.flatMap((g) => g.items).find((i) => active(i.href))

  return (
    <>
      {!ready && <div className="cms grid min-h-dvh place-items-center text-sm text-muted-foreground" role="status">Loading admin...</div>}
      {ready && !authed && (
        <AdminLogin
          onSuccess={() => {
            sessionStorage.setItem(KEY, '1')
            setAuthed(true)
          }}
        />
      )}
      <div hidden={!ready || !authed} className={cn('cms min-h-dvh text-[13px]', ready && authed ? 'flex' : '')}>
        <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground"><Store className="size-4" /></span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{settings.store.name}</p>
            <p className="text-[11px] text-muted-foreground">Admin console</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV.map((g) => (
            <div key={g.title} className="mb-4">
              <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{g.title}</p>
              {g.items.map((i) => (
                <Link key={i.href} href={i.href} className={cn('flex h-8 items-center gap-2 rounded-md px-2 text-[13px]', active(i.href) ? 'bg-primary/10 font-medium text-primary' : 'text-foreground/80 hover:bg-muted')}>
                  <i.icon className="size-4" />
                  {i.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{settings.admin.name}</p>
          <p>{settings.admin.email}</p>
        </div>
        </aside>
        {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4">
            <div className="flex items-center gap-2">
              <Btn size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="size-4" /></Btn>
              <span className="text-sm font-medium">{current?.label ?? 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle className="size-8" />
              <a href="/" target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[13px] hover:bg-muted"><ExternalLink className="size-3.5" />View store</a>
              <Btn onClick={() => { sessionStorage.removeItem(KEY); setAuthed(false) }}><LogOut className="size-3.5" />Sign out</Btn>
            </div>
          </header>
          <main className="w-full flex-1 p-4 sm:p-6 sm:max-w-[1500] sm:mx-auto">{children}</main>
        </div>
      </div>
    </>
  )
}
