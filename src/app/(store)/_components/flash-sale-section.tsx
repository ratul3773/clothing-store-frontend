import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { ProductCard } from "@/components/common/product-card";
import { products } from "@/lib/data/products";

export function FlashSaleSection() {
  const saleProducts = products
    .filter((product) => product.offerPrice || product.badges.includes("sale"))
    .slice(0, 4);

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-primary-foreground/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Clock3 className="size-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">
                Limited time only
              </p>
            </div>
            <h2 className="mt-3 font-display text-5xl font-black leading-[0.9] tracking-[-0.06em]">
              Flash sale.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-primary-foreground/70">
              Quiet prices on pieces that will not stay around for long.
            </p>
          </div>
          <Link
            href="/shop?badge=sale"
            className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-8"
          >
            Shop all sale <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
