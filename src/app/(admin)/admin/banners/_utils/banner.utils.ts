import { hero, heroAlt } from '@/data/catalog'
import type { Banner } from '@/data/site'

export type BannerDraft = { title: string; subtitle: string; image: string; ctaLabel: string; ctaLink: string; placement: Banner['placement']; order: string; active: boolean; startsAt: string; endsAt: string }
export type BannerErrors = Partial<Record<'title' | 'image' | 'ctaLink' | 'order' | 'endsAt', string>>

const pad = (n: number) => String(n).padStart(2, '0')
export const toLocal = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(+d) ? '' : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const bannerToDraft = (b: Banner | null, nextOrder: number): BannerDraft => ({
  title: b?.title ?? '', subtitle: b?.subtitle ?? '', image: b?.image ?? '', ctaLabel: b?.ctaLabel ?? 'Shop now', ctaLink: b?.ctaLink ?? '/shop',
  placement: b?.placement ?? 'hero', order: String(b?.order ?? nextOrder), active: b?.active ?? true, startsAt: toLocal(b?.startsAt), endsAt: toLocal(b?.endsAt),
})

export function validateBanner(d: BannerDraft): BannerErrors {
  const e: BannerErrors = {}
  if (!d.title.trim()) e.title = 'Title is required'
  if (!d.image.trim()) e.image = 'Image is required'
  if (d.ctaLink.trim() && !/^(\/|https?:\/\/)/.test(d.ctaLink.trim())) e.ctaLink = 'Start with / or https://'
  if (d.order === '' || isNaN(Number(d.order)) || Number(d.order) < 0) e.order = 'Must be 0 or more'
  if (d.startsAt && d.endsAt && +new Date(d.endsAt) <= +new Date(d.startsAt)) e.endsAt = 'End must be after start'
  return e
}

export const draftToBanner = (d: BannerDraft, id: string): Banner => ({
  id, title: d.title.trim(), subtitle: d.subtitle.trim(), image: d.image.trim(), ctaLabel: d.ctaLabel.trim(), ctaLink: d.ctaLink.trim(),
  placement: d.placement, order: Number(d.order), active: d.active,
  startsAt: d.startsAt ? new Date(d.startsAt).toISOString() : undefined, endsAt: d.endsAt ? new Date(d.endsAt).toISOString() : undefined,
})

export const sampleBanners = (): Omit<Banner, 'id'>[] => [
  { placement: 'hero', title: 'Dressed for Dhaka weather', subtitle: 'Breathable shirts and pants, cash on delivery nationwide.', image: hero, ctaLabel: 'Shop shirts', ctaLink: '/shop?cat=shirts', active: true, order: 1 },
  { placement: 'hero', title: 'The new everyday chino', subtitle: 'A clean taper that works from office to weekend.', image: heroAlt, ctaLabel: 'Shop pants', ctaLink: '/shop?cat=pants', active: true, order: 2 },
]

export function scheduleLabel(b: Banner): string {
  const f = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  if (!b.startsAt && !b.endsAt) return 'Always'
  return `${b.startsAt ? f(b.startsAt) : '…'} to ${b.endsAt ? f(b.endsAt) : '…'}`
}
