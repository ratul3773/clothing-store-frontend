export type Zone = 'dhaka' | 'outside'
export type Payment = 'COD' | 'SSLCOMMERZ'

export interface CheckoutFields {
  name: string
  phone: string
  address: string
  email: string
  note: string
}
