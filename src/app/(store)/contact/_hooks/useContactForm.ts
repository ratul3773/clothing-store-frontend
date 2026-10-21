'use client'

import { useState } from 'react'
import { addMessage } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { EMPTY_CONTACT, validateContact } from '@/app/(store)/contact/_schemas/contact.schema'
import type { ContactErrors, ContactFields } from '@/app/(store)/contact/_types/contact.types'

export default function useContactForm() {
  const { user, toast } = useStore()
  const [f, setF] = useState<ContactFields>({ ...EMPTY_CONTACT, name: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '' })
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof ContactFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((x) => ({ ...x, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateContact(f)
    setErrors(errs)
    if (Object.keys(errs).length) return
    addMessage({ name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), subject: f.subject.trim(), body: f.message.trim() })
    setSent(true)
    toast('Message sent. We will reply soon.')
  }

  const reset = () => { setF({ ...EMPTY_CONTACT }); setErrors({}); setSent(false) }

  return { f, set, errors, sent, submit, reset }
}
