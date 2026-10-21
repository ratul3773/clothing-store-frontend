import { coupons, products, type Combo } from '@/data/catalog'

export type Coupon = (typeof coupons)[number]
export type CouponDraft = { code: string; type: 'pct' | 'fix'; value: string; min: string; max: string; note: string }
export type CouponErrors = Partial<Record<'code' | 'value' | 'min' | 'max', string>>

export const emptyCoupon: CouponDraft = { code: '', type: 'pct', value: '10', min: '0', max: '0', note: '' }
export const couponToDraft = (c: Coupon): CouponDraft => ({ code: c.code, type: c.type, value: String(c.value), min: String(c.min), max: String(c.max), note: c.note })

export function validateCoupon(d: CouponDraft, prevCode?: string): CouponErrors {
  const e: CouponErrors = {}
  const code = d.code.trim().toUpperCase()
  if (!code) e.code = 'Code is required'
  else if (!/^[A-Z0-9_-]+$/.test(code)) e.code = 'Use letters, numbers, - or _ only'
  else if (code !== prevCode && coupons.some((c) => c.code === code)) e.code = 'This code already exists'
  const v = Number(d.value)
  if (!d.value || isNaN(v) || v <= 0) e.value = 'Enter a value greater than 0'
  else if (d.type === 'pct' && v > 100) e.value = 'Percentage cannot exceed 100'
  if (isNaN(Number(d.min)) || Number(d.min) < 0) e.min = 'Must be 0 or more'
  if (isNaN(Number(d.max)) || Number(d.max) < 0) e.max = 'Must be 0 or more'
  return e
}

export function draftToCoupon(d: CouponDraft): Coupon {
  const value = Number(d.value)
  const max = d.type === 'fix' ? value : Number(d.max)
  const code = d.code.trim().toUpperCase()
  const note = d.note.trim() || (d.type === 'pct' ? `${value}% off${max ? `, up to ৳${max}` : ''}` : `৳${value} off`)
  return { code, type: d.type, value, min: Number(d.min), max, note }
}

// combos
export type ComboDraft = { name: string; tag: string; image: string; price: string; items: Combo['items'] }
export type ComboErrors = Partial<Record<'name' | 'items' | 'price' | 'image', string>>
export const emptyCombo: ComboDraft = { name: '', tag: '', image: '', price: '', items: [] }
export const comboToDraft = (c: Combo): ComboDraft => ({ name: c.name, tag: c.tag, image: c.image, price: String(c.price), items: c.items.map((i) => ({ ...i })) })

export const partsTotal = (items: Combo['items']) => items.reduce((s, i) => {
  const p = products.find((x) => x.id === i.id)
  return s + (p ? (p.offer ?? p.price) : 0)
}, 0)

export function validateCombo(d: ComboDraft): ComboErrors {
  const e: ComboErrors = {}
  if (!d.name.trim()) e.name = 'Name is required'
  if (d.items.length < 2) e.items = 'Pick at least two products'
  const p = Number(d.price)
  if (!d.price || isNaN(p) || p <= 0) e.price = 'Enter a price greater than 0'
  if (!d.image.trim()) e.image = 'Image is required'
  return e
}
