export const inputCls =
  'h-12 w-full rounded-[3px] border border-foreground/40 bg-card px-4 text-sm outline-none transition placeholder:text-foreground/40 hover:border-foreground focus:border-accent focus:ring-2 focus:ring-accent/30'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono mb-1.5 block text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
