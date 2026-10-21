import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactSuccess({ onAnother }: { onAnother: () => void }) {
  return (
    <div className="rounded-[3px] border border-border bg-card/70 p-10 text-center">
      <CheckCircle2 size={44} className="mx-auto text-moss" />
      <p className="font-display mt-4 text-6xl">Message sent</p>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">Thanks for reaching out. Our team will get back to you on the number you gave us.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={onAnother} variant="outline">Send another</Button>
        <Button to="/shop">Keep shopping</Button>
      </div>
    </div>
  )
}
