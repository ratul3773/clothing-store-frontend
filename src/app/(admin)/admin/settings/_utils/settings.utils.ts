const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const url = /^https?:\/\/\S+$/i
export type Errors = Record<string, string | undefined>
const clean = (e: Errors) => Object.fromEntries(Object.entries(e).filter(([, v]) => v)) as Errors

export function validateStore(s: { name: string; tagline: string; email: string; phone: string; whatsapp: string; address: string }): Errors {
  return clean({
    name: s.name.trim() ? undefined : 'Store name is required',
    email: email.test(s.email) ? undefined : 'Enter a valid email',
    phone: s.phone.trim() ? undefined : 'Phone is required',
    whatsapp: /^\d{8,15}$/.test(s.whatsapp.replace(/\s/g, '')) ? undefined : 'Digits only, with country code',
    address: s.address.trim() ? undefined : 'Address is required',
  })
}

const nonNeg = (n: number) => (Number.isFinite(n) && n >= 0 ? undefined : 'Must be 0 or more')

export function validateDelivery(d: { dhaka: number; outside: number; freeAbove: number }, p: { cod: boolean; online: boolean }): Errors {
  return clean({ dhaka: nonNeg(d.dhaka), outside: nonNeg(d.outside), freeAbove: nonNeg(d.freeAbove), payments: p.cod || p.online ? undefined : 'Enable at least one payment method' })
}

export function validateAnnouncements(list: string[]): Errors {
  return clean({ list: list.some((x) => !x.trim()) ? 'Remove or fill empty messages' : undefined })
}

export function validateOrders(o: { prefix: string; exchangeDays: number; lowStock: number }): Errors {
  return clean({
    prefix: /^[A-Za-z0-9]{1,6}$/.test(o.prefix) ? undefined : '1-6 letters or digits',
    exchangeDays: Number.isInteger(o.exchangeDays) && o.exchangeDays >= 0 && o.exchangeDays <= 90 ? undefined : 'Whole number, 0-90',
    lowStock: Number.isInteger(o.lowStock) && o.lowStock >= 0 ? undefined : 'Whole number, 0 or more',
  })
}

export function validateSeo(s: { title: string; description: string }, so: { facebook: string; instagram: string }): Errors {
  return clean({
    title: s.title.trim() ? (s.title.length > 70 ? 'Keep under 70 characters' : undefined) : 'Title is required',
    description: s.description.length > 170 ? 'Keep under 170 characters' : undefined,
    facebook: !so.facebook || url.test(so.facebook) ? undefined : 'Must start with http(s)://',
    instagram: !so.instagram || url.test(so.instagram) ? undefined : 'Must start with http(s)://',
  })
}

export function validateAccount(a: { name: string; email: string }, pw: { current: string; next: string; confirm: string }, realPassword: string): Errors {
  const changing = !!(pw.current || pw.next || pw.confirm)
  return clean({
    name: a.name.trim() ? undefined : 'Name is required',
    email: email.test(a.email) ? undefined : 'Enter a valid email',
    current: changing && pw.current !== realPassword ? 'Current password is incorrect' : undefined,
    next: changing && pw.next.length < 6 ? 'At least 6 characters' : undefined,
    confirm: changing && pw.confirm !== pw.next ? 'Passwords do not match' : undefined,
  })
}
