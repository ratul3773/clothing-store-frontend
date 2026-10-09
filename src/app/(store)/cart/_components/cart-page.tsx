"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { StoreShell } from "@/components/layout/site-header";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { Price } from "@/components/common/price";
import { products } from "@/lib/data/products";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { removeItem, setQuantity } from "@/lib/redux/slices/cart-slice";
import { calculateCartTotals } from "@/lib/cart-totals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.slug === i.slug) }))
    .filter((i) => i.product);
  const totals = calculateCartTotals(items);
  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl font-black tracking-[-0.06em] text-primary">
          Your bag.
        </h1>
        {lines.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg">Your bag is quiet.</p>
            <Link
              href="/shop"
              className="mt-5 inline-block font-semibold underline underline-offset-8"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="divide-y divide-border border-y border-border">
              {lines.map(({ key, product, color, size, quantity }) => (
                <div key={key} className="flex gap-4 py-5">
                  <div className="relative size-28 shrink-0 bg-surface sm:size-36">
                    <Image
                      src={product!.images[0]}
                      fill
                      alt={product!.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/product/${product!.slug}`}
                      className="font-semibold"
                    >
                      {product!.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {color} · {size}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-3">
                      <QuantityStepper
                        label={`Quantity for ${product!.name}`}
                        value={quantity}
                        onChange={(v) =>
                          dispatch(setQuantity({ key, quantity: v }))
                        }
                      />
                      <Price
                        price={product!.price}
                        offerPrice={product!.offerPrice}
                        size="sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${product!.name}`}
                    onClick={() => dispatch(removeItem(key))}
                    className="self-start"
                  >
                    <Trash2 data-icon="inline-start" />
                  </Button>
                </div>
              ))}
            </div>
            <aside className="h-fit border border-border p-6">
              <h2 className="font-display text-2xl font-bold">Summary</h2>
              <div className="mt-6 grid gap-3 border-b border-border pb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{totals.subtotal.toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>
                    {totals.deliveryFee === 0
                      ? "Free"
                      : `৳${totals.deliveryFee}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-5 font-bold">
                <span>Total</span>
                <span>৳{totals.total.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Promo code" aria-label="Promo code" />
                <Button variant="outline">Apply</Button>
              </div>
              <Link href="/checkout" className="mt-5 block">
                <Button className="w-full">Continue to checkout</Button>
              </Link>
              <Link
                href="/shop"
                className="mt-4 block text-center text-sm font-semibold underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
    </StoreShell>
  );
}
