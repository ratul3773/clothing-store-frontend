import type { Address } from '@/components/providers/StoreProvider'

export const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export const isMobileValid = (v: string) => /^01\d[\d\s]{8,}$/.test(v.trim())

export const isProfileValid = (name: string, phone: string) => name.trim().length > 1 && isMobileValid(phone)

export const isAddressValid = (a: Address | null) =>
  !!a && !!a.label.trim() && !!a.name.trim() && isMobileValid(a.phone) && !!a.line.trim() && !!a.city.trim()

export const passwordRules = (p: string) => [
  ['8+ characters', p.length >= 8],
  ['Upper & lower case', /[a-z]/.test(p) && /[A-Z]/.test(p)],
  ['A number', /\d/.test(p)],
  ['A symbol', /[^\w\s]/.test(p)],
] as const

export const passwordScore = (p: string) => passwordRules(p).filter(([, ok]) => ok).length

export function validatePasswordChange(storedPassword: string | undefined, f: { cur: string; next: string; again: string }): string | null {
  if (storedPassword && f.cur !== storedPassword) return 'Current password is incorrect'
  if (passwordScore(f.next) < 3 || f.next.length < 8) return 'Choose a stronger password'
  if (f.next === f.cur) return 'New password must differ from the current one'
  if (f.next !== f.again) return 'Passwords do not match'
  return null
}

export const validateReview = (rating: number, text: string) => {
  if (rating < 1) return 'Choose a star rating'
  if (text.trim().length < 10) return 'Tell us a little more (at least 10 characters)'
  return ''
}
