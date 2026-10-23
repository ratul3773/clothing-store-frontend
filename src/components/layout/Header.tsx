'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNavigate } from '@/lib/nav'
import { AnimatePresence, motion } from 'motion/react'
import ThemeToggle from '@/components/common/ThemeToggle'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useStore } from '@/components/providers/StoreProvider'
import NavMenu from '@/components/layout/NavMenu'
import { taxonomy } from '@/data/catalog'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'
import BrandName from '@/components/common/BrandName'
import { Tip } from '@/components/ui/controls'
import { Button } from '../ui/button'

export default function Header({profileButton}: {profileButton: React.ReactNode}) {
  useCms()
  const { count, setCartOpen, wishlist } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const items = settings.announcements.filter((a) => a.trim())

  return (
    <header className="sticky top-0 z-50">
      {items.length > 0 && (
        <div className="overflow-hidden bg-foreground py-2 text-background">
          <div className="marquee-track label-mono flex w-max gap-12 whitespace-nowrap">
            {Array.from({ length: Math.max(4, Math.ceil(16 / items.length)) }, () => items).flat().map((t, i) => (
              <span key={i} className="flex items-center gap-12">
                {t} <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-340 items-center gap-6 px-5 lg:px-10">
          <button className="lg:hidden" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/" className="font-display leading-none">
            <BrandName name={settings.store.name} />
          </Link>
          <div className="ml-6"><NavMenu /></div>
          <div className="ml-auto flex items-center gap-1">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                navigate(`/shop?q=${encodeURIComponent(q)}`)
                setSearchOpen(false)
              }}
              className="flex items-center"
            >
              <motion.input
                aria-label="Search products or SKU"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name or SKU…"
                initial={false}
                animate={{ width: searchOpen ? 190 : 0, opacity: searchOpen ? 1 : 0, paddingInline: searchOpen ? 12 : 0 }}
                className="h-9 border-b border-foreground bg-transparent text-sm outline-none"
              />
              <button type={searchOpen && q ? 'submit' : 'button'} onClick={() => !q && setSearchOpen((s) => !s)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-foreground hover:text-background">
                <Search size={19} />
              </button>
            </form>
            <ThemeToggle className="border-transparent" />
              <Tip label="Wishlist">
              <Link href="/account?tab=wishlist" aria-label="Wishlist">
              <Button
                aria-label="Wishlist"
                size="icon"
                variant="ghost"
                className="h-10 w-10 place-items-center rounded-full"
              >
                <Heart size={19} />
                 {wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {wishlist.length}
                  </span>
                )}
              </Button>
              </Link>
            </Tip>
            
            <Button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${count} items`}
              size="icon"
              variant="ghost"
              className="h-10 w-10 place-items-center rounded-full"
            >
              <ShoppingBag size={18} />
              <AnimatePresence mode="popLayout">
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, y: -8 }}
                    animate={{ scale: 1, y: 0 }}
                    className="label-mono absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.65rem] text-accent-foreground"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            {profileButton}
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <div className="flex flex-col px-5 py-3">
                {[{ to: '/shop', label: 'All', subs: [] as string[], cat: '' }, ...taxonomy.map((t) => ({ to: `/shop?cat=${t.cat}`, label: t.label, subs: t.subs, cat: t.cat })), { to: '/shop?offers=1', label: 'Offers', subs: [] as string[], cat: '' }, { to: '/contact', label: 'Contact', subs: [] as string[], cat: '' }, { to: '/account', label: 'Account', subs: [] as string[], cat: '' }].map((n, i) => (
                  <motion.div key={n.label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/60 py-2">
                    <Link href={n.to} onClick={() => setMenu(false)} className="block text-lg">{n.label}</Link>
                    {n.subs.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2 pb-2">
                        {n.subs.map((s) => (
                          <Link key={s} href={`/shop?cat=${n.cat}&sub=${s}`} onClick={() => setMenu(false)} className="rounded-full border border-foreground/30 px-3 py-1.5 transition hover:bg-foreground hover:text-background">{s}</Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
