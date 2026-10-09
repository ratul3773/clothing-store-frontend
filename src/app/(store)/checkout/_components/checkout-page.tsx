"use client";
import Link from "next/link";
import { useState } from "react";
import { StoreShell } from "@/components/layout/site-header";
import { useAppSelector } from "@/lib/redux/store";
import { products } from "@/lib/data/products";
import { calculateCartTotals } from "@/lib/cart-totals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function CheckoutPage() {
  const [method, setMethod] = useState("cod");
  const [done, setDone] = useState(false);
  const items = useAppSelector((s) => s.cart.items);
  const totals = calculateCartTotals(items);
  if (done)
    return (
      <StoreShell>
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-success text-success-foreground">
            ✓
          </div>
          <h1 className="mt-6 font-display text-5xl font-black text-primary">
            Order received.
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Thank you. We’ll confirm your order by phone and get it moving soon.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block font-semibold underline underline-offset-8"
          >
            Back to shop
          </Link>
        </main>
      </StoreShell>
    );
  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link href="/cart" className="text-sm text-muted-foreground">
            ← Back to bag
          </Link>
          <h1 className="mt-5 font-display text-5xl font-black tracking-[-0.06em] text-primary">
            Checkout.
          </h1>
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <form
            className="grid gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <section>
              <h2 className="font-display text-2xl font-bold">
                Contact & delivery
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required placeholder="Your full name" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" required placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <Label htmlFor="email">
                    Email{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Delivery address</Label>
                  <Input
                    id="address"
                    required
                    placeholder="House, road, area"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required defaultValue="Dhaka" />
                </div>
                <div>
                  <Label htmlFor="area">Area / district</Label>
                  <Input
                    id="area"
                    required
                    placeholder="Gulshan, Dhanmondi..."
                  />
                </div>
              </div>
            </section>
            <section>
              <h2 className="font-display text-2xl font-bold">
                Payment method
              </h2>
              <RadioGroup
                value={method}
                onValueChange={setMethod}
                className="mt-5 gap-3"
              >
                <label className="flex cursor-pointer items-start gap-3 border border-border p-4">
                  <RadioGroupItem value="cod" />
                  <span>
                    <strong className="block text-sm">Cash on delivery</strong>
                    <span className="text-xs text-muted-foreground">
                      Pay when your order arrives
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 border border-border p-4">
                  <RadioGroupItem value="bkash" />
                  <span>
                    <strong className="block text-sm">bKash / Nagad</strong>
                    <span className="text-xs text-muted-foreground">
                      We’ll share payment instructions after placing
                    </span>
                  </span>
                </label>
              </RadioGroup>
            </section>
            <Button type="submit" className="h-12">
              Place order
            </Button>
          </form>
          <aside className="h-fit bg-surface p-6">
            <h2 className="font-display text-2xl font-bold">Order summary</h2>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{totals.subtotal.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>৳{totals.deliveryFee}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-4 font-bold">
                <span>Total</span>
                <span>৳{totals.total.toLocaleString("en-BD")}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </StoreShell>
  );
}
