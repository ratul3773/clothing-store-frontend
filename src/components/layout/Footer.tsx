'use client'

import Link from 'next/link'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import BrandName from '@/components/common/BrandName'
import { taxonomy } from '@/data/catalog'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'
import { bdt } from '@/lib/utils'

export default function Footer() {
  useCms()
  const { store, delivery, social, orders } = settings
  const wa = store.whatsapp.replace(/\D/g, '')
  const shopLinks = [...taxonomy.map((t) => [t.label, `/shop?cat=${t.cat}`]), ['Offers', '/shop?offers=1'], ['Combos', '/#combos'], ['Contact', '/contact']]
  return (
    <footer className="mt-32 bg-foreground text-background">
      <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-20 lg:px-10">
        <p className="font-display text-[clamp(4rem,17vw,16rem)] leading-[0.8] text-background/95">
          <BrandName name={store.name} />
        </p>
        {store.tagline && <p className="label-mono mt-6 text-background/60">{store.tagline}</p>}
        <div className="mt-14 grid gap-10 border-t border-background/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label-mono mb-4 text-background/50">Shop</p>
            <ul className="space-y-2 text-sm">
              {shopLinks.map(([l, t]) => (
                <li key={l}><Link className="transition hover:text-accent" href={t}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-mono mb-4 text-background/50">Help</p>
            <ul className="space-y-2 text-sm text-background/80">
              <li>Delivery: {bdt(delivery.dhaka)} Dhaka · {bdt(delivery.outside)} outside</li>
              <li>Free delivery above {bdt(delivery.freeAbove)}</li>
              <li>Return to rider at the door</li>
              <li>Exchange within {orders.exchangeDays} days</li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-4 text-background/50">Account</p>
            <ul className="space-y-2 text-sm">
              <li><Link className="transition hover:text-accent" href="/account">My orders</Link></li>
              <li><Link className="transition hover:text-accent" href="/account?tab=wishlist">Wishlist</Link></li>
              <li><Link className="transition hover:text-accent" href="/admin">Owner panel</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-[3px] border border-background/30 p-5 transition hover:border-accent hover:bg-accent"
              >
                <span>
                  <span className="label-mono block text-background/60 group-hover:text-background">Questions about fit?</span>
                  <span className="font-display mt-2 block text-3xl">Chat on WhatsApp</span>
                </span>
                <MessageCircle className="transition group-hover:rotate-12" />
              </a>
            )}
            <ul className="space-y-2 text-sm text-background/80">
              {store.address && <li className="flex gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-accent" />{store.address}</li>}
              {store.phone && <li className="flex gap-2"><Phone size={15} className="mt-0.5 shrink-0 text-accent" /><a href={`tel:${store.phone.replace(/\s/g, '')}`} className="transition hover:text-accent">{store.phone}</a></li>}
              {store.email && <li className="flex gap-2"><Mail size={15} className="mt-0.5 shrink-0 text-accent" /><a href={`mailto:${store.email}`} className="transition hover:text-accent">{store.email}</a></li>}
            </ul>
            {(social.facebook || social.instagram) && (
              <div className="label-mono flex gap-5">
                {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="underline-offset-4 transition hover:text-accent hover:underline">Facebook</a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="underline-offset-4 transition hover:text-accent hover:underline">Instagram</a>}
              </div>
            )}
          </div>
        </div>
        <p className="label-mono mt-12 text-background/40">© 2026 {store.name} · {store.address || 'Dhaka, Bangladesh'}</p>
      </div>
    </footer>
  )
}
