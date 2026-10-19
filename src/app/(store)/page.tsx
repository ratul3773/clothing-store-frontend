import Hero from '@/app/(store)/_components/Hero'
import CategoryTiles from '@/app/(store)/_components/CategoryTiles'
import PromoBanners from '@/app/(store)/_components/PromoBanners'
import FlashSaleStrip from '@/app/(store)/_components/FlashSaleStrip'
import BestSellers from '@/app/(store)/_components/BestSellers'
import ComboDeals from '@/app/(store)/_components/ComboDeals'
import TrustStrip from '@/app/(store)/_components/TrustStrip'
import ReviewSlider from '@/app/(store)/_components/ReviewSlider'
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div className="h-[600px] w-full animate-pulse bg-muted" />}>
      <Hero />
      </Suspense>
      <CategoryTiles />
      <Suspense fallback={<div className="h-[600px] w-full animate-pulse bg-muted" />}>
      <PromoBanners />
      </Suspense>
      <FlashSaleStrip />
      <BestSellers />
      <ComboDeals />
      <TrustStrip />
      <ReviewSlider />
    </div>
  )
}