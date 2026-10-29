import { BadgeCheck, CreditCard, RefreshCw, Truck } from 'lucide-react'
 type NeuralQA = { id: string; q: string; a: string; tag: string }
export const HERO_WORDS = ['Dressed', 'for the', 'humidity.']

export const TRUST_ITEMS = [
  { Icon: BadgeCheck, title: 'Order as a guest', text: 'Name, phone, address. Done. Create an account later and your history follows.' },
  { Icon: CreditCard, title: 'COD or SSLCommerz', text: 'Pay at the door or online by card and mobile banking.' },
  { Icon: Truck, title: 'Pathao & Steadfast', text: 'We assign the courier and share an external tracking link.' },
  { Icon: RefreshCw, title: '7-day exchange', text: 'Wrong size? Request a swap after delivery. We check replacement stock first.' },
]


/** Hero neural background: questions and their answers (the "next bubble"). */
export const NEURAL_QA: NeuralQA[] = [
  { id: 'size', tag: 'Fit', q: 'Which size fits me?', a: 'Open any product and tap the size assistant. Enter your height and weight and get a recommended size in seconds.' },
  { id: 'guest', tag: 'Checkout', q: 'Do I need an account?', a: 'No. Name, phone and address is all it takes. Sign up later and your order history follows you.' },
  { id: 'track', tag: 'Delivery', q: 'Where is my parcel?', a: 'We hand it to Pathao or Steadfast and share an external tracking link on your order page.' },
  { id: 'swap', tag: 'Exchange', q: 'Wrong size on arrival?', a: 'Request a swap within 7 days of delivery. We check replacement stock first, so nothing gets stuck.' },
  { id: 'pay', tag: 'Payment', q: 'How do I pay?', a: 'Cash on delivery at your door, or online with SSLCommerz by card and mobile banking.' },
]

/**
 * Node positions as percentages of the hero stage. `lg` spreads the graph across the whole hero with the core on the right;
 * `sm` is the stacked mobile stage. Dots d1-d4 are the inner ring, d5+ the outer ring.
 */
export const NEURAL_LAYOUT = {
  lg: {
    core: { x: 76, y: 52 },
    nodes: {
      size: { x: 58, y: 17 }, guest: { x: 89, y: 22 }, track: { x: 90, y: 78 }, swap: { x: 72, y: 91 }, pay: { x: 55, y: 70 },
      d1: { x: 64, y: 40 }, d2: { x: 88, y: 46 }, d3: { x: 80, y: 68 }, d4: { x: 68, y: 30 },
      d5: { x: 46, y: 44 }, d6: { x: 40, y: 12 }, d7: { x: 34, y: 66 }, d8: { x: 54, y: 94 }, d9: { x: 96, y: 56 }, d10: { x: 22, y: 38 }, d11: { x: 12, y: 80 }, d12: { x: 8, y: 14 },
    },
  },
  sm: {
    core: { x: 50, y: 55 },
    nodes: {
      size: { x: 34, y: 9 }, guest: { x: 68, y: 23 }, track: { x: 70, y: 81 }, swap: { x: 36, y: 92 }, pay: { x: 28, y: 40 },
      d1: { x: 54, y: 38 }, d2: { x: 74, y: 52 }, d3: { x: 60, y: 70 }, d4: { x: 38, y: 68 },
      d5: { x: 12, y: 24 }, d6: { x: 86, y: 8 }, d7: { x: 10, y: 56 }, d8: { x: 90, y: 68 }, d9: { x: 92, y: 36 }, d10: { x: 14, y: 90 }, d11: { x: 52, y: 20 }, d12: { x: 84, y: 94 },
    },
  },
} as const

export const NEURAL_RING1 = ['size', 'guest', 'track', 'swap', 'pay', 'd1', 'd2', 'd3', 'd4']

/** `core` is the centre of the graph; every other id is a node from NEURAL_LAYOUT. */
export const NEURAL_EDGES: [string, string][] = [
  ['core', 'size'], ['core', 'guest'], ['core', 'track'], ['core', 'swap'], ['core', 'pay'],
  ['core', 'd1'], ['core', 'd2'], ['core', 'd3'], ['core', 'd4'],
  ['d4', 'size'], ['d4', 'guest'], ['d2', 'guest'], ['d2', 'track'], ['d3', 'track'], ['d3', 'swap'], ['d1', 'pay'], ['d1', 'd4'], ['pay', 'swap'], ['pay', 'd3'],
  ['size', 'd6'], ['size', 'd5'], ['pay', 'd5'], ['pay', 'd7'], ['swap', 'd8'], ['track', 'd9'], ['guest', 'd9'],
  ['d5', 'd10'], ['d6', 'd10'], ['d7', 'd11'], ['d10', 'd12'], ['d7', 'd10'], ['d6', 'd12'], ['d8', 'd7'], ['d11', 'd10'],
]

export const HOW_STEPS = [
  { n: '01', title: 'Pick your piece', text: 'Browse shirts and pants cut for Dhaka weather. Filter by size, colour and price.', stat: '40+ styles' },
  { n: '02', title: 'Find your size', text: 'Use the size assistant on the product page. Height, weight, fit preference. Done.', stat: '30 seconds' },
  { n: '03', title: 'Order as a guest', text: 'Name, phone, address. Pay on delivery or online with SSLCommerz.', stat: 'No account' },
  { n: '04', title: 'Track and swap', text: 'Follow the courier link. If it does not fit, exchange within 7 days.', stat: '7-day swap' },
]

export const HOME_STATS = [
  { value: 12000, suffix: '+', label: 'Parcels delivered' },
  { value: 64, suffix: '', label: 'Districts covered' },
  { value: 7, suffix: ' days', label: 'Exchange window' },
  { value: 4.8, suffix: '/5', label: 'Average rating', decimals: 1 },
]
