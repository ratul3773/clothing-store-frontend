'use client'

import * as T from '@radix-ui/react-tabs'
import { TabsContent, TabsList } from '@/components/ui/tabs'
import { useStore } from '@/components/providers/StoreProvider'
import AccountHeader from '@/app/(store)/account/_components/AccountHeader'
import AddressesTab from '@/app/(store)/account/_components/AddressesTab'
import CouponsTab from '@/app/(store)/account/_components/CouponsTab'
import ExchangeSheet from '@/app/(store)/account/_components/ExchangeSheet'
import ReviewsTab from '@/app/(store)/account/_components/ReviewsTab'
import ReviewFormSheet from '@/app/(store)/account/_components/ReviewFormSheet'
import OrdersTab from '@/app/(store)/account/_components/OrdersTab'
import ProfileSettings from '@/app/(store)/account/_components/ProfileSettings'
import SecuritySettings from '@/app/(store)/account/_components/SecuritySettings'
import SignedOut from '@/app/(store)/account/_components/SignedOut'
import WishlistTab from '@/app/(store)/account/_components/WishlistTab'
import useAccountTab from '@/app/(store)/account/_hooks/useAccountTab'
import useReviewForm from '@/app/(store)/account/_hooks/useReviewForm'
import useExchange from '@/app/(store)/account/_hooks/useExchange'
import { stripSpaces } from '@/app/(store)/account/_utils/account.utils'

const NO_ANIM = 'data-[state=active]:animate-none'

export default function AccountView() {
  const { user, orders, wishlist } = useStore()
  const [tab, setTab] = useAccountTab()
  const x = useExchange()
  const rf = useReviewForm()

  if (!user) return <SignedOut />

  const phone = stripSpaces(user.phone)
  const mine = orders.filter((o) => stripSpaces(o.customer.phone) === phone)
  const linked = mine.filter((o) => !o.guest)
  const delivered = linked.filter((o) => o.status === 'DELIVERED')
  const unlinked = mine.filter((o) => o.guest)

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-10">
      <AccountHeader name={user.name} />
      <T.Root value={tab} onValueChange={setTab} className="mt-10">
        <TabsList value={tab} layoutId="acc-tab" items={[{ value: 'orders', label: 'Orders', count: linked.length }, { value: 'wishlist', label: 'Wishlist', count: wishlist.length }, { value: 'reviews', label: 'Reviews' }, { value: 'addresses', label: 'Addresses' }, { value: 'coupons', label: 'Coupons' }, { value: 'settings', label: 'Settings' }, { value: 'security', label: 'Security' }]} />
        <TabsContent value="orders" className={`space-y-4 ${NO_ANIM}`}><OrdersTab linked={linked} unlinked={unlinked} onExchange={x.open} /></TabsContent>
        <TabsContent value="wishlist" className={NO_ANIM}><WishlistTab /></TabsContent>
        <TabsContent value="reviews" className={NO_ANIM}><ReviewsTab delivered={delivered} form={rf} /></TabsContent>
        <TabsContent value="addresses" className={NO_ANIM}><AddressesTab /></TabsContent>
        <TabsContent value="coupons" className={`grid gap-4 md:grid-cols-2 ${NO_ANIM}`}><CouponsTab /></TabsContent>
        <TabsContent value="settings" className={NO_ANIM}><ProfileSettings /></TabsContent>
        <TabsContent value="security" className={NO_ANIM}><SecuritySettings /></TabsContent>
      </T.Root>
      <ExchangeSheet x={x} />
      <ReviewFormSheet f={rf} />
    </div>
  )
}
