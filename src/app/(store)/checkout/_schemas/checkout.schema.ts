import type { CheckoutFields } from '@/app/(store)/checkout/_types/checkout.types'

export const isPhoneValid = (v: string) => /^[0-9 +]{10,15}$/.test(v.trim())

export const isCheckoutValid = (f: CheckoutFields) =>
  !!f.name.trim() && isPhoneValid(f.phone) && f.address.trim().length > 6
