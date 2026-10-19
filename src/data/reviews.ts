import { byId } from '@/data/catalog'
import { DEMO_REFERENCE_TIME } from '@/data/demoTime'

export const MAX_REVIEW_IMAGES = 3
export const FIT_OPTIONS = ['Runs small', 'Perfect', 'Runs large'] as const
export type Fit = (typeof FIT_OPTIONS)[number]

export type Review = {
  id: string
  productId: string
  orderId?: string
  author: string
  userKey: string
  rating: number
  fit: Fit
  text: string
  images: string[]
  createdAt: string
  seed?: boolean
  hidden?: boolean
  reply?: { text: string; at: string }
}

const D = (n: number) => new Date(DEMO_REFERENCE_TIME - n * 864e5).toISOString()
const pic = (id: string, i = 0) => byId(id).images[i]

export const seedReviews: Review[] = [
  { id: 'r1', productId: 'p1', author: 'Imran H.', userKey: '01811000001', rating: 5, fit: 'Perfect', text: "Holds its collar all day in Motijheel traffic. Ordered L at 5'9\", 74kg, fits clean.", images: [pic('p1', 1)], createdAt: D(9), seed: true, reply: { text: 'Thank you Imran! Glad the collar stays crisp. See you for the next drop.', at: D(8) } },
  { id: 'r2', productId: 'p6', author: 'Sakib R.', userKey: '01811000002', rating: 4, fit: 'Runs small', text: 'Great stretch but I sized up to 34. Delivery in two days, paid on arrival.', images: [], createdAt: D(14), seed: true, reply: { text: 'Appreciate the sizing note, Sakib. We have added it to the fit guide.', at: D(13) } },
  { id: 'r3', productId: 'p3', author: 'Farhan A.', userKey: '01811000003', rating: 5, fit: 'Perfect', text: 'Linen feels expensive. The size assistant nailed M on the first try.', images: [pic('p3', 1), pic('p3', 0)], createdAt: D(20), seed: true },
  { id: 'r4', productId: 'p2', author: 'Rafiq M.', userKey: '01811000004', rating: 5, fit: 'Perfect', text: 'Poplin is crisp and breathes well. Wore it to two weddings already.', images: [], createdAt: D(26), seed: true },
  { id: 'r5', productId: 'p7', author: 'Nayeem K.', userKey: '01811000005', rating: 4, fit: 'Runs large', text: 'Cargo pockets are deep and the fabric is heavy. Take one size down.', images: [pic('p7', 1)], createdAt: D(31), seed: true, reply: { text: 'Thanks Nayeem, sizing down is noted for others.', at: D(30) } },
  { id: 'r6', productId: 'p1', author: 'Tarek Z.', userKey: '01811000006', rating: 5, fit: 'Perfect', text: 'Second Oxford I have bought. Stitching is far better than the price suggests.', images: [], createdAt: D(38), seed: true },
  { id: 'r7', productId: 'p8', author: 'Shuvo D.', userKey: '01811000007', rating: 5, fit: 'Perfect', text: 'Pleats sit properly and the waist does not dig in. Office approved.', images: [], createdAt: D(44), seed: true },
]
