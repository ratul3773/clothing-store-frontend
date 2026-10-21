import { Button } from '@/components/ui/button'

export default function OrderNotFound() {
  return (
    <div className="py-40 text-center">
      <p className="font-display sm:text-lg">Order not found</p>
      <Button to="/" className="mt-6">Home</Button>
    </div>
  )
}
