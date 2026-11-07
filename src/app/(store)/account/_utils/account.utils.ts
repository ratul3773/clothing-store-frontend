import type { Order } from '@/data/orders'

export const stripSpaces = (v: string) => v.replace(/\s/g, '')

export const isExchangeEligible = (o: Order, now: number) =>
  o.status === 'DELIVERED' && !o.exchange && o.deliveredAt && now - +new Date(o.deliveredAt) < 7 * 864e5

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export const readImage = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
