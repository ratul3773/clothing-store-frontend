'use client'

import Reveal from '@/components/common/Reveal'
import ContactForm from '@/app/(store)/contact/_components/ContactForm'
import ContactSuccess from '@/app/(store)/contact/_components/ContactSuccess'
import StoreInfoPanel from '@/app/(store)/contact/_components/StoreInfoPanel'
import useContactForm from '@/app/(store)/contact/_hooks/useContactForm'

export default function ContactView() {
  const c = useContactForm()
  return (
    <div className="mx-auto max-w-[88rem] px-5 py-12 lg:px-10">
      <p className="label-mono text-muted-foreground">We usually reply within a day</p>
      <h1 className="font-display text-[clamp(4rem,10vw,9rem)]">Contact</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>{c.sent ? <ContactSuccess onAnother={c.reset} /> : <ContactForm c={c} />}</Reveal>
        <Reveal delay={0.1}><StoreInfoPanel /></Reveal>
      </div>
    </div>
  )
}
