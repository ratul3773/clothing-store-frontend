import { Button } from '@/components/ui/button'
import type { Payment } from '@/app/(store)/checkout/_types/checkout.types'

interface Props { disc: number; fee: number; total: number; pay: Payment; valid: boolean; onPlace: () => void }

/** Kept for the future checkout form; no client-calculated payable totals. */
export default function OrderSummary(props: Props) {
  void props;
  return <aside className="space-y-4 border border-border p-6"><p>Order totals will be calculated securely when checkout is available.</p><Button disabled>Checkout coming soon</Button></aside>
}
