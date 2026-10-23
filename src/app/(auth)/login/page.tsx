'use client'

import { useState } from 'react'
import AuthForm from '@/components/common/auth/auth-form'

export default function Page(){
  
  const [tab, setTab] = useState("in")
  function handleTabChange(value: string) {
    setTab(value)
  }
    return (
        <div className="flex items-center justify-center py-3">
            <AuthForm />
        </div>
    );
}