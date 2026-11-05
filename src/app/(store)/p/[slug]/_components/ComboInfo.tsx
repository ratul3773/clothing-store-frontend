"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { settings } from "@/data/site";
import { bdt } from "@/lib/utils";
import useCart from "@/hooks/useCart";
import { openCartDrawer } from "@/lib/cart-ui";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import ComboComponents from "@/components/common/ComboComponents";
import type { ComboSelection } from "@/redux/apis/types/combo.types";
import ProductSummary from "./ProductSummary";
import PurchaseActions from "./PurchaseActions";
import SizePicker from "./SizePicker";

export default function ComboInfo({ p }: { p: Product }) {
  const { cart, edit, reload } = useCart();
  const { wishlist, toggleWish } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const pending = useRef(false);
  const items = p.items ?? [];
  const selections: ComboSelection[] = items.flatMap((item) =>
    choices[item.id]
      ? [{ comboItemId: item.id, variantId: choices[item.id] }]
      : [],
  );
  const complete = items.length > 0 && selections.length === items.length;
  const capacity = Math.min(
    50,
    ...items.map((item) => {
      const selected = item.variants.find(
        (variant) => variant.id === choices[item.id],
      );
      return selected
        ? selected.maxQuantity
        : Math.max(0, ...item.variants.map((variant) => variant.maxQuantity));
    }),
  );
  const canAdd =
    complete &&
    !!p.comboId &&
    !!p.inStock &&
    quantity <= capacity &&
    cart.ready &&
    !cart.loading &&
    !cart.busy;
  const add = async () => {
    if (!canAdd || pending.current || !p.comboId) return;
    pending.current = true;
    try {
      if (
        await edit({
          type: "addCombo",
          comboId: p.comboId,
          quantity,
          selections,
        })
      ) {
        setQuantity(1);
      }
    } finally {
      pending.current = false;
    }
  };
  return (
    <div className="lg:sticky lg:top-32 lg:self-start">
      <ProductSummary p={p} />
      <h2 className="mt-6 font-semibold">Included pieces</h2>
      <p className="text-sm text-muted-foreground">
        Fixed colors; choose a size for each product/color. Each combo contains{" "}
        {p.items?.reduce((sum, item) => sum + item.quantity, 0)} pieces.
      </p>
      <ComboComponents items={items} />
      <p className="mb-3 text-xs text-muted-foreground">
        Availability per size is shown in full combo units, accounting for
        repeated pieces.
      </p>
      <div className="space-y-4" aria-label="Combo size selections">
        {items.map((item) => {
          const selected = item.variants.find(
            (variant) => variant.id === choices[item.id],
          );
          return (
            <fieldset
              key={item.id}
              className="min-w-0 rounded border border-border p-3"
              disabled={cart.busy}
            >
              <legend className="px-1 text-sm font-medium">
                Size for {item.product.name} - {item.color.name}
                {item.quantity > 1
                  ? ` (${item.quantity} pieces, same size)`
                  : ""}
              </legend>
              <SizePicker
                sizes={item.variants.map((variant) => variant.size)}
                selected={selected?.size ?? null}
                avail={selected?.maxQuantity ?? null}
                disabled={cart.busy}
                minimumQuantity={quantity}
                showStockCounts
                stockUnit="combo units"
                stockFor={(size) =>
                  item.variants.find((variant) => variant.size === size)
                    ?.maxQuantity ?? 0
                }
                onSelect={(size) => {
                  const variant = item.variants.find(
                    (variant) => variant.size === size,
                  );
                  if (!variant) return;
                  setChoices((current) => ({
                    ...current,
                    [item.id]: variant.id,
                  }));
                }}
              />
              {!item.variants.length && (
                <p className="text-sm text-muted-foreground">
                  No sizes available for this piece.
                </p>
              )}
            </fieldset>
          );
        })}
      </div>
      <p role="status" className="my-3 text-sm">
        {p.inStock
          ? complete
            ? `Up to ${capacity} combo units available in these sizes. Your bag may reduce this limit.`
            : "Choose sizes to see availability"
          : "Currently out of stock"}
      </p>
      <p className="mb-3 text-xs text-muted-foreground">
        Quantity adds more combo units. Edit quantities already in your bag
        there.
      </p>
      <PurchaseActions
        qty={quantity}
        liked={wishlist.includes(p.id)}
        onDec={() => setQuantity((q) => Math.max(1, q - 1))}
        onInc={() => setQuantity((q) => Math.min(capacity, q + 1))}
        onAdd={() => void add()}
        onWish={() => toggleWish(p.id)}
        canAdd={canAdd}
        canIncrease={quantity < capacity && !cart.busy}
        canDecrease={quantity > 1 && !cart.busy}
        adding={cart.busy}
        isInCart={false}
      />
      {cart.error && (
        <div role="alert" className="mt-3">
          <p className="text-destructive">{cart.error}</p>
          <Button size="sm" variant="outline" onClick={() => void reload()}>
            Reload bag
          </Button>
        </div>
      )}
      <div className="mt-6 border-t border-border pt-4 text-sm">
        <h2 className="font-semibold">Delivery</h2>
        <p>
          {bdt(settings.delivery.dhaka)} inside Dhaka,{" "}
          {bdt(settings.delivery.outside)} outside. Free above{" "}
          {bdt(settings.delivery.freeAbove)}.
        </p>
      </div>
    </div>
  );
}
