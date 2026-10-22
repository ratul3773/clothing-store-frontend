'use client'

import { useState } from 'react'

/** Local editable copy of a settings slice with dirty detection and reset. */
export default function useDraft<T>(source: T) {
  const [draft, setDraft] = useState<T>(() => structuredClone(source))
  const [submitted, setSubmitted] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(source)
  const patch = (p: Partial<T>) => setDraft((d) => ({ ...d, ...p }))
  const reset = () => { setDraft(structuredClone(source)); setSubmitted(false) }
  return { draft, setDraft, patch, dirty, reset, submitted, setSubmitted }
}
