export function shopTitle(cat: string, sub: string | null) {
  const label = cat === 'all' ? '' : cat.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  return sub ? `${sub} ${label}`.trim() : cat === 'all' ? 'The shop' : label
}
