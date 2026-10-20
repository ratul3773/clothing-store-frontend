import { Button } from '@/components/ui/button'

export default function EmptyBag() {
  return <div className="py-40 text-center"><p className="font-display text-8xl text-foreground/20">Bag is empty</p><Button to="/shop" className="mt-6">Browse the shop</Button></div>
}
