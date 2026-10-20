'use client'

import { useState } from 'react'
import { useStore, type Address } from '@/components/providers/StoreProvider'
import { isAddressValid } from '@/app/(store)/account/_schemas/account.schema'
import { blankAddress, demoAddresses } from '@/app/(store)/account/_utils/account.utils'

export default function useAddressBook() {
  const { user, setUser, toast } = useStore()
  const u = user!
  const list: Address[] = u.addresses ?? demoAddresses(u)
  const [form, setForm] = useState<Address | null>(null)
  const [del, setDel] = useState<Address | null>(null)

  const commit = (next: Address[]) => setUser({ ...u, addresses: next })
  const valid = isAddressValid(form)

  const save = () => {
    if (!form || !valid) return
    const a = { ...form, label: form.label.trim(), name: form.name.trim(), phone: form.phone.trim(), line: form.line.trim(), city: form.city.trim() }
    let next: Address[]
    if (a.id) next = list.map((x) => (x.id === a.id ? a : x))
    else next = [...list, { ...a, id: 'a' + Date.now() }]
    if (a.isDefault || next.length === 1) {
      const target = a.id || next[next.length - 1].id
      next = next.map((x) => ({ ...x, isDefault: x.id === target }))
    }
    commit(next)
    toast(a.id ? 'Address updated' : 'Address added')
    setForm(null)
  }

  const remove = (a: Address) => {
    let next = list.filter((x) => x.id !== a.id)
    if (a.isDefault && next.length) next = next.map((x, i) => ({ ...x, isDefault: i === 0 }))
    commit(next)
    setDel(null)
    toast('Address deleted')
  }

  const makeDefault = (a: Address) => { commit(list.map((x) => ({ ...x, isDefault: x.id === a.id }))); toast('Default address changed') }
  const startNew = () => setForm(blankAddress(u.name, u.phone))

  return { list, form, setForm, del, setDel, valid, save, remove, makeDefault, startNew }
}
