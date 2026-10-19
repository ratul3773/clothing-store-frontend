'use client'

import { motion } from 'motion/react'

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute -right-[20%] top-0 h-full w-[55%] origin-top-right -skew-x-12 bg-secondary/60" />
      <motion.div
        className="absolute -left-24 top-[10%] h-[34rem] w-[34rem] rounded-full bg-accent/20 blur-[110px]"
        animate={{ x: [0, 90, -30, 0], y: [0, 70, 120, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 bottom-[5%] h-[38rem] w-[38rem] rounded-full bg-moss/25 blur-[120px]"
        animate={{ x: [0, -100, 20, 0], y: [0, -60, -110, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.28]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="weave" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M0 22h44M22 0v44" stroke="currentColor" strokeOpacity=".07" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#weave)" />
        {[18, 46, 78].map((y, i) => (
          <line
            key={y}
            x1="0"
            x2="100%"
            y1={`${y}%`}
            y2={`${y + (i % 2 ? -6 : 6)}%`}
            stroke="#e4442b"
            strokeWidth="1.5"
            strokeDasharray="10 14"
            className="stitch"
            style={{ animationDuration: `${7 + i * 3}s` }}
          />
        ))}
      </svg>
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  )
}
