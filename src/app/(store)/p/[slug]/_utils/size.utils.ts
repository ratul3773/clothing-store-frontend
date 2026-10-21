import { sizeChart, type Product } from '@/data/catalog'

export function recommend(p: Product, h: number, w: number, pref: string) {
  // Numeric sizes (30, 32…) are waist sizes; lettered sizes are chest sizes.
  const shirts = !p.sizes.every((s) => /^\d+(\.\d+)?$/.test(s))
  const target = shirts ? 28 + w * 0.17 + (h - 170) * 0.02 + (pref === 'loose' ? 1 : pref === 'slim' ? -0.5 : 0) : 22 + w * 0.17 + (h - 170) * 0.02 + (pref === 'loose' ? 1 : 0)
  const chart = (sizeChart[p.category] ?? []).filter((r) => p.sizes.includes(r.size))
  // Categories without a size chart fall back to the middle size on offer.
  const pick = chart.length ? chart.find((r) => parseFloat(r.a) >= target - 0.4) ?? chart[chart.length - 1] : { size: p.sizes[Math.floor(p.sizes.length / 2)] ?? '' }
  return { size: pick.size, target: target.toFixed(1), shirts }
}
