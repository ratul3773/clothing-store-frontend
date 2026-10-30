'use client'

import Link from 'next/link'
import * as NM from '@radix-ui/react-navigation-menu'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { useCms } from '@/lib/useCms'
import { useGetCategoriesQuery } from '@/redux/apis/category.api'

const trigger =
  'label-mono group relative flex items-center gap-1 px-3 py-2 outline-none transition-colors hover:text-accent data-[state=open]:text-accent'
const underline =
  'absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-data-[state=open]:scale-x-100'

export default function NavMenu() {
  useCms()
  const { data: categories = [] } = useGetCategoriesQuery()
  const maxcategories = categories.slice(0, 5)
  return (
    <NM.Root className="relative hidden lg:block" delayDuration={80}>
      <NM.List className="flex items-center gap-1">
        <NM.Item>
          <NM.Link asChild>
            <Link href="/shop" className={trigger}>All<span className={underline} /></Link>
          </NM.Link>
        </NM.Item>
        {maxcategories.map((category) => (
          <NM.Item key={category.id}>
            <NM.Trigger className={trigger}>
              {category.name}
              <ChevronDown size={12} className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
              <span className={underline} />
            </NM.Trigger>
            <NM.Content className="absolute left-0 top-full pt-3 data-[motion=from-end]:animate-[fadein_.3s_ease] data-[motion=from-start]:animate-[fadein_.3s_ease] data-[state=open]:animate-[fadein_.3s_ease]">
              <div className="grid w-[34rem] grid-cols-[1fr_12rem] overflow-hidden rounded-[3px] border border-foreground bg-card shadow-2xl">
                 <ul className="p-3">
                  <li>
                    <NM.Link asChild>
                      <Link href={`/shop?cat=${category.slug}`} className="group flex items-center justify-between rounded-[2px] px-3 py-2.5 transition hover:bg-foreground hover:text-background">
                        <span className="sm:text-lg">All {category.name}</span>
                        <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </NM.Link>
                  </li>
                   {(category.children ?? []).map((subcategory) => {
                     return (
                       <li key={subcategory.id}>
                         <NM.Link asChild>
                           <Link href={`/shop?cat=${category.slug}&sub=${subcategory.slug}`} className="group flex items-center justify-between rounded-[2px] px-3 py-2.5 text-sm transition hover:translate-x-1 hover:bg-accent/10 hover:text-accent">
                             {subcategory.name}
                             <span className="label-mono text-muted-foreground">{subcategory.productCount}</span>
                          </Link>
                        </NM.Link>
                      </li>
                    )
                  })}
                </ul>
                <div className="relative bg-foreground text-background">
                   {category.imageUrl && <img src={category.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
                   <p className="absolute inset-x-3 bottom-3 text-xs leading-snug">{category.description ?? `Explore ${category.name}.`}</p>
                </div>
              </div>
            </NM.Content>
          </NM.Item>
        ))}
        <NM.Item>
          <NM.Link asChild>
            <Link href="/shop?offers=1" className={trigger}>Offers<span className={underline} /></Link>
          </NM.Link>
        </NM.Item>
        <NM.Item>
          <NM.Link asChild>
            <Link href="/contact" className={trigger}>Contact<span className={underline} /></Link>
          </NM.Link>
        </NM.Item>
      </NM.List>
    </NM.Root>
  )
}
