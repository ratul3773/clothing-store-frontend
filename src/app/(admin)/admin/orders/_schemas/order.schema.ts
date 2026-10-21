import { products } from '@/data/catalog'
import type { ManualDraft } from '@/app/(admin)/admin/orders/_types/orders.types'

export type Errors = Record<string, string>

export function validateCustomer(c: { name: string; phone: string; address: string }): Errors {
  const e: Errors = {}
  if (!c.name.trim()) e.name = 'Name is required'
  if (c.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number'
  if (!c.address.trim()) e.address = 'Address is required'
  return e
}

export function validateManual(d: ManualDraft): Errors {
  const e = validateCustomer(d)
  if (!d.lines.length) e.lines = 'Add at least one product'
  d.lines.forEach((l) => {
    const p = products.find((x) => x.id === l.productId)
    if (!p || !l.color || !l.size) e.lines = 'Choose colour and size for every line'
    else if (l.qty < 1) e.lines = 'Quantity must be at least 1'
    else if (l.qty > (p.stock[`${l.color}|${l.size}`] ?? 0)) e.lines = `Not enough stock for ${p.name} (${l.color} / ${l.size})`
  })
  if (d.discount !== '' && !(Number(d.discount) >= 0)) e.discount = 'Discount must be 0 or more'
  if (d.deliveryOverride !== '' && !(Number(d.deliveryOverride) >= 0)) e.deliveryOverride = 'Delivery must be 0 or more'
  return e
}
