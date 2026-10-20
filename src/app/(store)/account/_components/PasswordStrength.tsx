'use client'

import { motion } from 'motion/react'

interface Props {
  score: number
  rules: readonly (readonly [string, boolean])[]
}

export default function PasswordStrength({ score, rules }: Props) {
  return (
    <div>
      <div className="flex gap-1.5">{[0, 1, 2, 3].map((i) => <motion.span key={i} animate={{ backgroundColor: i < score ? (score < 3 ? '#e4442b' : '#2f4a3c') : 'rgba(16,23,20,.15)' }} className="h-1.5 flex-1 rounded-full" />)}</div>
      <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">{rules.map(([l, ok]) => <li key={l} className={ok ? 'text-moss' : 'text-muted-foreground'}>{ok ? '✓' : '○'} {l}</li>)}</ul>
    </div>
  )
}
