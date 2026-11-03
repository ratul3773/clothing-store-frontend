"use client";

import Reveal from "@/components/common/Reveal";
import ProductCard from "@/components/common/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetCombosQuery } from "@/redux/apis/combo.api";
import { toStorefrontCombo } from "@/lib/public-product";
import ProductGridSkeleton from "@/components/common/ProductSkeleton/ProductGridSkeleton";

export default function ComboDeals() {
  const { data, isLoading, isError, refetch } = useGetCombosQuery({
    page: 1,
    limit: 4,
  });
  if (!isLoading && !isError && !data?.items.length) return null;
  return (
    <section id="combos" className="mt-32 py-12">
        <Reveal className="mb-12 max-w-2xl">
          <p className="label-mono text-accent">Fixed combinations</p>
          <h2 className="font-display mt-3 text-4xl">Better together</h2>
        </Reveal>
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
        isError ? (
          <div role="alert">
            <p>Could not load combos.</p>
            <Button onClick={() => void refetch()}>Retry combos</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {data?.items.map((combo, index) => (
                <ProductCard
                  key={combo.id}
                  p={toStorefrontCombo(combo)}
                  index={index}
                />
              ))
              }
          </div>
        ))}
    </section>
  );
}
