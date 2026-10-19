'use client'

import { useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import { isEmailValid } from '@/app/(store)/account/_schemas/account.schema'

export default function useEmailChange() {
  const { user, setUser, toast } = useStore()
  const [newEmail, setNewEmailState] = useState('')
  const [pending, setPending] = useState<{ email: string; code: string } | null>(null)
  const [code, setCodeState] = useState('')
  const [err, setErr] = useState('')

  const setNewEmail = (v: string) => { setNewEmailState(v); setErr('') }
  const setCode = (v: string) => { setCodeState(v.replace(/\D/g, '')); setErr('') }
  const cancel = () => { setPending(null); setErr('') }

  const sendCode = () => {
    if (!isEmailValid(newEmail)) return setErr('Enter a valid email address')
    if (newEmail.toLowerCase() === user!.email.toLowerCase()) return setErr('That is already your email')
    const c = String(Math.floor(100000 + Math.random() * 900000))
    setPending({ email: newEmail, code: c })
    setErr('')
    setCodeState('')
    toast(`Demo: verification code ${c} sent to ${newEmail}`)
  }

  const verify = () => {
    if (code !== pending!.code) return setErr('Incorrect code, try again')
    setUser({ ...user!, email: pending!.email })
    setPending(null)
    setNewEmailState('')
    setErr('')
    toast('Email verified and updated')
  }

  return { user: user!, newEmail, setNewEmail, pending, code, setCode, err, sendCode, verify, cancel }
}
