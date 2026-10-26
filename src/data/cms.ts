import { combos, coupons, products, taxonomy, type Product, type Taxon } from '@/data/catalog'
import { banners, emit, flashSales, settings, type Banner, type FlashSale, type Settings } from '@/data/site'
import { DEMO_REFERENCE_TIME } from '@/data/demoTime'
import { useId } from 'react'

export { emit }

export type Message = {
  id: string
  name: string
  phone: string
  email: string
  subject: string
  body: string
  createdAt: string
  status: 'new' | 'open' | 'resolved'
  replies: { text: string; at: string }[]
}

export type CustomerMeta = { blocked?: boolean; tags?: string[]; note?: string }

const ago = (h: number) => new Date(DEMO_REFERENCE_TIME - h * 36e5).toISOString()

export const messages: Message[] = [
  { id: 'm1', name: 'Rafiq Hasan', phone: '01811 223344', email: 'rafiq@example.com', subject: 'Bulk order for office uniforms', body: 'We need 40 formal shirts for our team in Motijheel. Do you offer a corporate discount?', createdAt: ago(5), status: 'new', replies: [] },
  { id: 'm2', name: 'Nusrat Jahan', phone: '01911 556677', email: 'nusrat@example.com', subject: 'Size exchange', body: 'I ordered a size M but need L. How do I request an exchange?', createdAt: ago(30), status: 'open', replies: [{ text: 'Please use Exchange from your account orders page within 7 days.', at: ago(24) }] },
  { id: 'm3', name: 'Imran Kabir', phone: '01611 998877', email: 'imran@example.com', subject: 'Delivery outside Dhaka', body: 'How many days for delivery to Sylhet?', createdAt: ago(80), status: 'resolved', replies: [{ text: 'Usually 2-4 working days via Steadfast.', at: ago(70) }] },
]

export const customerMeta: Record<string, CustomerMeta> = {}

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const uid = (p: string) => `${p}${Date.now().toString(36)}${useId()}`

const change = <T,>(fn: () => T): T => {
  const r = fn()
  emit()
  return r
}

// products
export const saveProduct = (p: Product) =>
  change(() => {
    const i = products.findIndex((x) => x.id === p.id)
    if (i >= 0) products[i] = p
    else products.unshift({ ...p, custom: true })
  })
export const deleteProduct = (id: string) =>
  change(() => {
    const i = products.findIndex((x) => x.id === id)
    if (i >= 0) products.splice(i, 1)
    products.forEach((p) => (p.look = p.look.filter((l) => l !== id)))
    flashSales.forEach((f) => (f.productIds = f.productIds.filter((l) => l !== id)))
  })
export const setProductStock = (id: string, stock: Record<string, number>) =>
  change(() => {
    const p = products.find((x) => x.id === id)
    if (p) p.stock = stock
  })

// taxonomy
export const saveCategory = (t: Taxon, prevCat?: string) =>
  change(() => {
    const i = taxonomy.findIndex((x) => x.cat === (prevCat ?? t.cat))
    if (i >= 0) {
      if (prevCat && prevCat !== t.cat) products.forEach((p) => p.category === prevCat && (p.category = t.cat))
      taxonomy[i] = t
    } else taxonomy.push(t)
  })
export const deleteCategory = (cat: string) =>
  change(() => {
    const i = taxonomy.findIndex((x) => x.cat === cat)
    if (i >= 0) taxonomy.splice(i, 1)
  })
export const renameSub = (cat: string, from: string, to: string) =>
  change(() => {
    products.forEach((p) => p.category === cat && p.sub === from && (p.sub = to))
    const t = taxonomy.find((x) => x.cat === cat)
    if (t) t.subs = t.subs.map((s) => (s === from ? to : s))
  })

// combos
export const saveCombo = (c: (typeof combos)[number]) =>
  change(() => {
    const i = combos.findIndex((x) => x.id === c.id)
    if (i >= 0) combos[i] = c
    else combos.push(c)
  })
export const deleteCombo = (id: string) =>
  change(() => {
    const i = combos.findIndex((x) => x.id === id)
    if (i >= 0) combos.splice(i, 1)
  })

// coupons
export const saveCoupon = (c: (typeof coupons)[number], prevCode?: string) =>
  change(() => {
    const i = coupons.findIndex((x) => x.code === (prevCode ?? c.code))
    if (i >= 0) coupons[i] = c
    else coupons.push(c)
  })
export const deleteCoupon = (code: string) =>
  change(() => {
    const i = coupons.findIndex((x) => x.code === code)
    if (i >= 0) coupons.splice(i, 1)
  })

// banners
export const saveBanner = (b: Banner) =>
  change(() => {
    const i = banners.findIndex((x) => x.id === b.id)
    if (i >= 0) banners[i] = b
    else banners.push(b)
    banners.sort((a, c) => a.order - c.order)
  })
export const deleteBanner = (id: string) =>
  change(() => {
    const i = banners.findIndex((x) => x.id === id)
    if (i >= 0) banners.splice(i, 1)
  })

// flash sales
export const saveFlash = (f: FlashSale) =>
  change(() => {
    const i = flashSales.findIndex((x) => x.id === f.id)
    if (i >= 0) flashSales[i] = f
    else flashSales.push(f)
  })
export const deleteFlash = (id: string) =>
  change(() => {
    const i = flashSales.findIndex((x) => x.id === id)
    if (i >= 0) flashSales.splice(i, 1)
  })

// settings
export const saveSettings = (patch: Partial<Settings>) => change(() => void Object.assign(settings, patch))

// messages
export const patchMessage = (id: string, patch: Partial<Message>) =>
  change(() => {
    const m = messages.find((x) => x.id === id)
    if (m) Object.assign(m, patch)
  })
export const addMessage = (m: Omit<Message, 'id' | 'createdAt' | 'status' | 'replies'>) =>
  change(() => void messages.unshift({ ...m, id: uid('m'), createdAt: new Date().toISOString(), status: 'new', replies: [] }))
export const deleteMessage = (id: string) =>
  change(() => {
    const i = messages.findIndex((x) => x.id === id)
    if (i >= 0) messages.splice(i, 1)
  })

// customers
export const patchCustomer = (key: string, patch: CustomerMeta) => change(() => void (customerMeta[key] = { ...customerMeta[key], ...patch }))
