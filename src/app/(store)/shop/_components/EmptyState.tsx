import { Button } from '@/components/ui/button'

export default function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-2xl text-foreground/20">No match</p>
      <Button className="mt-6" onClick={onClear}>Clear filters</Button>
    </div>
  )
}
