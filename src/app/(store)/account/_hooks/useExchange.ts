'use client'

import { useState } from 'react'
import type { Order } from '@/data/orders'

export default function useExchange() {
  const [ex, setEx] = useState<Order | null>(null)
  const [reason, setReason] = useState('Too tight')
  const [newSize, setNewSize] = useState('')
  const open = (o: Order) => { setEx(o); setNewSize('') }
  return { ex, close: () => setEx(null), open, reason, setReason, newSize, setNewSize }
}
