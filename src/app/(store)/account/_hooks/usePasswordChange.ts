'use client'

import { useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import { passwordRules, validatePasswordChange } from '@/app/(store)/account/_schemas/account.schema'

const empty = { cur: '', next: '', again: '' }

export default function usePasswordChange() {
  const { user, setUser, toast } = useStore()
  const [f, setF] = useState(empty)
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setErr('') }
  const rules = passwordRules(f.next)
  const score = rules.filter(([, ok]) => ok).length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const problem = validatePasswordChange(user!.password, f)
    if (problem) return setErr(problem)
    setUser({ ...user!, password: f.next })
    setF(empty)
    toast('Password changed')
  }

  return { f, set, show, toggleShow: () => setShow((s) => !s), err, rules, score, submit }
}
