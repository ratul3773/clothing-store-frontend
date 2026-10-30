import Hero from '@/app/(store)/_components/Hero'
import CategoryTiles from '@/app/(store)/_components/CategoryTiles'
import PromoBanners from '@/app/(store)/_components/PromoBanners'
import FlashSaleStrip from '@/app/(store)/_components/FlashSaleStrip'
import BestSellers from '@/app/(store)/_components/BestSellers'
import ComboDeals from '@/app/(store)/_components/ComboDeals'
import TrustStrip from '@/app/(store)/_components/TrustStrip'
import ReviewSlider from '@/app/(store)/_components/ReviewSlider'
import { Suspense } from 'react'
import NewArrivals from './_components/NewArrival'
import HowItWorks from './_components/HowItWorks'

export default function Page() {
  return (
    <div>
      <Hero />
      <CategoryTiles />
      <PromoBanners />
      <FlashSaleStrip />
      <NewArrivals />
      <BestSellers />
      <ComboDeals />
      <HowItWorks />
      <TrustStrip />
      <ReviewSlider />
    </div>
  )
}