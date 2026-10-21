'use client'

import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'

export default function StoreInfoPanel() {
  useCms()
  const { store } = settings
  const wa = store.whatsapp.replace(/\D/g, '')
  const rows = [
    store.address && { Icon: MapPin, label: 'Visit', node: store.address },
    store.phone && { Icon: Phone, label: 'Call', node: <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="transition hover:text-accent">{store.phone}</a> },
    store.email && { Icon: Mail, label: 'Email', node: <a href={`mailto:${store.email}`} className="transition hover:text-accent">{store.email}</a> },
    { Icon: Clock, label: 'Hours', node: 'Sat – Thu, 10:00 – 20:00 (Fri closed)' },
  ].filter((r) => typeof r !== 'string')
  return (
    <aside className="rounded-[3px] bg-foreground p-7 text-background lg:sticky lg:top-32 lg:self-start">
      <p className="label-mono text-background/60">{store.name}</p>
      {store.tagline && <p className="font-display mt-2 text-4xl">{store.tagline}</p>}
      <ul className="mt-8 divide-y divide-background/15">
        {rows.map(({ Icon, label, node }) => (
          <li key={label} className="flex gap-4 py-4">
            <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
            <div><p className="label-mono text-background/50">{label}</p><div className="mt-1 text-sm">{node}</div></div>
          </li>
        ))}
      </ul>
      {wa && (
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="group mt-4 flex items-center justify-between rounded-[3px] border border-background/30 p-4 transition hover:border-accent hover:bg-accent">
          <span className="font-display text-2xl">Chat on WhatsApp</span>
          <MessageCircle className="transition group-hover:rotate-12" />
        </a>
      )}
    </aside>
  )
}
