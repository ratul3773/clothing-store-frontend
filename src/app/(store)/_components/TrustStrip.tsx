import Reveal from '@/components/common/Reveal'
import { TRUST_ITEMS } from '@/app/(store)/_constants/home.constants'

export default function TrustStrip() {
  return (
    <section className=" mt-28 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {TRUST_ITEMS.map(({ Icon, title, text }, i) => (
        <Reveal key={title} delay={i * 0.08} className="group bg-background p-7 transition-colors hover:bg-card">
          <Icon className="mb-4 text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6" size={30} />
          <h3 className="font-display text-lg">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
        </Reveal>
      ))}
    </section>
  )
}
