'use client'

import * as T from '@radix-ui/react-tabs'
import { TabsContent, TabsList } from '@/components/ui/tabs'
import { useStore } from '@/components/providers/StoreProvider'
import AccountHeader from './AccountHeader'
import AddressesTab from './AddressesTab'
import CouponsTab from './CouponsTab'
import ExchangeSheet from './ExchangeSheet'
import ReviewsTab from './ReviewsTab'
import ReviewFormSheet from './ReviewFormSheet'
import OrdersTab from './OrdersTab'
import ProfileSettings from './ProfileSettings'
import SecuritySettings from './SecuritySettings'
import SignedOut from './SignedOut'
import WishlistTab from './WishlistTab'
import useAccountTab from '../_hooks/useAccountTab'
import useReviewForm from '../_hooks/useReviewForm'
import useExchange from '../_hooks/useExchange'
import { stripSpaces } from '../_utils/account.utils'

const NO_ANIM = 'data-[state=active]:animate-none'

export default function AccountView({user}: {
  user: {
    isAuthenticated:boolean,
    name:string,
    email:string,
    phone:string,
    role:string
  }
}) {
  const { orders, wishlist } = useStore()
  const [tab, setTab] = useAccountTab()
  const x = useExchange()
  const rf = useReviewForm()

  if (!user.isAuthenticated) return <SignedOut />

  const phone = stripSpaces(user.phone)
  const mine = orders.filter((o) => stripSpaces(o.customer.phone) === phone)
  const linked = mine.filter((o) => !o.guest)
  const delivered = linked.filter((o) => o.status === 'DELIVERED')
  const unlinked = mine.filter((o) => o.guest)

  return (
    <div className="">
      <AccountHeader name={user.name} />
      <T.Root value={tab} onValueChange={setTab} className="mt-10">
        <TabsList 
        variant='line' 
        value={tab} 
        layoutId="acc-tab" 
        items={[
          { value: 'orders', label: 'Orders', count: linked.length },
          { value: 'wishlist', label: 'Wishlist', count: wishlist.length },
          { value: 'reviews', label: 'Reviews' },
          { value: 'addresses', label: 'Addresses' },
          { value: 'coupons', label: 'Coupons' },
          { value: 'settings', label: 'Settings' },
          { value: 'security', label: 'Security' }
        ]} />
        <TabsContent value="orders" className={`space-y-4 ${NO_ANIM}`}><OrdersTab linked={linked} unlinked={unlinked} onExchange={x.open} /></TabsContent>
        <TabsContent value="wishlist" className={NO_ANIM}><WishlistTab /></TabsContent>
        <TabsContent value="reviews" className={NO_ANIM}><ReviewsTab delivered={delivered} form={rf} /></TabsContent>
        <TabsContent value="addresses" className={NO_ANIM}><AddressesTab /></TabsContent>
        <TabsContent value="coupons" className={`grid gap-4 md:grid-cols-3 ${NO_ANIM}`}><CouponsTab /></TabsContent>
        <TabsContent value="settings" className={NO_ANIM}><ProfileSettings user={user} /></TabsContent>
        <TabsContent value="security" className={NO_ANIM}><SecuritySettings /></TabsContent>
      </T.Root>
      <ExchangeSheet x={x} />
      <ReviewFormSheet f={rf} />
    </div>
  )
}
