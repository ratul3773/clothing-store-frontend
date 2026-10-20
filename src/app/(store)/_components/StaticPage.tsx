'use client'

import Link from 'next/link'
import { useCms } from '@/lib/useCms'
import { settings } from '@/data/site'
import { staticPages, type StaticPageKey } from '@/app/(store)/_constants/static-pages.constants'

export default function StaticPage({ page }: { page: StaticPageKey }) {
  useCms()
  const content = staticPages[page](settings)

  return (
    <article>
      <header className="border-b border-border pb-10">
        <p className="label-mono text-muted-foreground">{content.eyebrow}</p>
        <h1 className="mt-3 font-display text-lg sm:text-3xl font-medium leading-[0.95]">{content.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{content.intro}</p>
      </header>

      <div className="divide-y divide-border">
        {content.sections.map((section) => (
          <section key={section.heading} className="py-8">
            <h2 className="font-display text-sm sm:text-lg">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="border-t border-border pt-8 text-sm text-muted-foreground">
        Need help? <Link href="/contact" className="text-foreground underline underline-offset-4 transition hover:text-accent">Contact our team</Link>.
      </p>
    </article>
  )
}
