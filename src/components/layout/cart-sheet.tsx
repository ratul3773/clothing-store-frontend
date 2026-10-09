"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { products } from "@/lib/data/products";
import { calculateCartTotals } from "@/lib/cart-totals";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { removeItem } from "@/lib/redux/slices/cart-slice";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const lines = items
    .map((item) => ({
      ...item,
      product: products.find((product) => product.slug === item.slug),
    }))
    .filter((item) => item.product);
  const totals = calculateCartTotals(items);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your bag</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Your bag is quiet."
              : `${items.reduce((sum, item) => sum + item.quantity, 0)} items ready to check out.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Add something from the collection.
              </p>
              <Link
                href="/shop"
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Shop the collection
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {lines.map(({ key, product, color, size, quantity }) => (
                <div key={key} className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface">
                    <Image
                      src={product!.images[0]}
                      alt={product!.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product!.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="line-clamp-2 text-sm font-semibold hover:underline"
                    >
                      {product!.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {color} · {size} · Qty {quantity}
                    </p>
                    <p className="mt-2 text-sm font-bold">
                      ৳
                      {(
                        (product!.offerPrice ?? product!.price) * quantity
                      ).toLocaleString("en-BD")}
                    </p>
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
          )}
        </div>

        {lines.length > 0 && (
          <SheetFooter className="border-t border-border pt-5 sm:flex-col sm:items-stretch">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Subtotal</span>
              <span>৳{totals.subtotal.toLocaleString("en-BD")}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/cart"
                onClick={() => onOpenChange(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-semibold transition-colors hover:bg-muted"
              >
                View full cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => onOpenChange(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Checkout
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
