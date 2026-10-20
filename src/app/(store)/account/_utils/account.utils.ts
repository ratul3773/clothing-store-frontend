import type { Address, User } from '@/components/providers/StoreProvider'
import type { Order } from '@/data/orders'

export const blankAddress = (name: string, phone: string): Address => ({ id: '', label: '', name, phone, line: '', city: 'Dhaka', isDefault: false })

export const stripSpaces = (v: string) => v.replace(/\s/g, '')

export const isExchangeEligible = (o: Order) =>
  o.status === 'DELIVERED' && !o.exchange && o.deliveredAt && Date.now() - +new Date(o.deliveredAt) < 7 * 864e5

export const demoAddresses = (u: User): Address[] => [
  { id: 'a1', label: 'Home', name: u.name, phone: u.phone, line: 'House 14, Road 7, Dhanmondi', city: 'Dhaka', isDefault: true },
  { id: 'a2', label: 'Office', name: u.name, phone: u.phone, line: 'Level 5, Motijheel C/A', city: 'Dhaka', isDefault: false },
]

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export const readImage = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
