'use client'

import HeroClassic from '@/app/(store)/_components/HeroClassic'
import HeroCarousel from '@/app/(store)/_components/HeroCarousel'
import useNow from '@/lib/useNow'
import { useCms } from '@/lib/useCms'
import { liveBanners } from '@/lib/storefront'

/** Shows scheduled CMS hero banners when any are live, otherwise the classic editorial hero. */
export default function Hero() {
  useCms()
  const now = useNow(30_000)
  // The ticking clock re-evaluates banner schedules; CMS banners only exist client-side so hydration is unaffected.
  const banners = now === null ? [] : liveBanners('hero', now)
  return banners.length > 0 ? <HeroCarousel banners={banners} /> : <HeroClassic />
}
