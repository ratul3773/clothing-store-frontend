"use client";

import Reveal from "@/components/common/Reveal";
import ProductCard from "@/components/common/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetCombosQuery } from "@/redux/apis/combo.api";
import { toStorefrontCombo } from "@/lib/public-product";

export default function ComboDeals() {
  const { data, isLoading, isError, refetch } = useGetCombosQuery({ page: 1, limit: 3 });
  if (!isLoading && !isError && !data?.items.length) return null;
  return <section id="combos" className="mt-32 bg-muted py-24">
    <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
      <Reveal className="mb-12 max-w-2xl"><p className="label-mono text-accent">Fixed combinations</p><h2 className="font-display mt-3 text-4xl">Better together</h2></Reveal>
      {isError ? <div role="alert"><p>Could not load combos.</p><Button onClick={() => void refetch()}>Retry combos</Button></div> :
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">{isLoading ? [0, 1, 2].map((i) => <Skeleton key={i} className="aspect-[4/5]" />) : data?.items.map((combo, index) => <ProductCard key={combo.id} p={toStorefrontCombo(combo)} index={index} />)}</div>}
    </div>
  </section>;
}
