'use client'

import { useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import { MAX_REVIEW_IMAGES, type Fit } from '@/data/reviews'
import { validateReview } from '@/app/(store)/account/_schemas/account.schema'
import { MAX_IMAGE_BYTES, readImage } from '@/app/(store)/account/_utils/account.utils'
import type { ReviewTarget } from '@/app/(store)/account/_types/review.types'

export default function useReviewForm() {
  const { user, addReview, toast } = useStore()
  const [target, setTarget] = useState<ReviewTarget | null>(null)
  const [rating, setRating] = useState(0)
  const [fit, setFit] = useState<Fit>('Perfect')
  const [text, setText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [err, setErr] = useState('')

  const open = (t: ReviewTarget) => { setTarget(t); setRating(0); setFit('Perfect'); setText(''); setImages([]); setErr('') }

  const addFiles = async (files: FileList | null) => {
    if (!files) return
    const room = MAX_REVIEW_IMAGES - images.length
    const picked = [...files].filter((f) => f.type.startsWith('image/')).slice(0, room)
    if (files.length > room) toast(`Up to ${MAX_REVIEW_IMAGES} photos per review`)
    const ok = picked.filter((f) => f.size <= MAX_IMAGE_BYTES)
    if (ok.length < picked.length) setErr('Photos must be under 2 MB each')
    const urls = await Promise.all(ok.map(readImage))
    setImages((im) => [...im, ...urls].slice(0, MAX_REVIEW_IMAGES))
  }

  const submit = () => {
    const e = validateReview(rating, text)
    if (e) return setErr(e)
    addReview({ productId: target!.item.productId, orderId: target!.order.id, author: user!.name, userKey: user!.phone.replace(/\s/g, ''), rating, fit, text: text.trim(), images })
    toast('Thanks! Your review is live')
    setTarget(null)
  }

  return { target, close: () => setTarget(null), open, rating, setRating, fit, setFit, text, setText: (v: string) => { setText(v); setErr('') }, images, removeImage: (i: number) => setImages((im) => im.filter((_, k) => k !== i)), addFiles, err, submit }
}
