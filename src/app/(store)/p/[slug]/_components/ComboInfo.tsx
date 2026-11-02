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
import ProductSummary from "./ProductSummary";
import PurchaseActions from "./PurchaseActions";

export default function ComboInfo({ p }: { p: Product }) {
  const { cart, edit, reload } = useCart();
  const { wishlist, toggleWish } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const pending = useRef(false);
  const capacity = Math.min(p.maxQuantity ?? 0, 50);
  const canAdd = !!p.comboId && !!p.inStock && quantity <= capacity && cart.ready && !cart.loading && !cart.busy && !adding;
  const add = async () => {
    if (!canAdd || pending.current || !p.comboId) return;
    pending.current = true;
    setAdding(true);
    try {
      if (await edit({ type: "addCombo", comboId: p.comboId, quantity })) {
        toast.success("Combo added to your bag");
        setQuantity(1);
        openCartDrawer();
      }
    } finally { pending.current = false; setAdding(false); }
  };
  return <div className="lg:sticky lg:top-32 lg:self-start">
    <ProductSummary p={p} />
    <h2 className="mt-6 font-semibold">Included pieces</h2>
    <p className="text-sm text-muted-foreground">Fixed colors and sizes. Each combo contains {p.items?.reduce((sum, item) => sum + item.quantity, 0)} pieces.</p>
    <ComboComponents items={p.items ?? []} />
    <p role="status" className="my-3 text-sm">{p.inStock ? `${p.maxQuantity} combos in stock` : "Currently out of stock"}</p>
    <p className="mb-3 text-xs text-muted-foreground">Quantity adds more combo units. Edit quantities already in your bag there.</p>
    <PurchaseActions qty={quantity} liked={wishlist.includes(p.id)} onDec={() => setQuantity((q) => Math.max(1, q - 1))} onInc={() => setQuantity((q) => Math.min(capacity, q + 1))} onAdd={() => void add()} onWish={() => toggleWish(p.id)} canAdd={canAdd} canIncrease={quantity < capacity && !cart.busy} canDecrease={quantity > 1 && !cart.busy} adding={adding} isInCart={false} />
    {cart.error && <div role="alert" className="mt-3"><p className="text-destructive">{cart.error}</p><Button size="sm" variant="outline" onClick={() => void reload()}>Reload bag</Button></div>}
    <div className="mt-6 border-t border-border pt-4 text-sm"><h2 className="font-semibold">Delivery</h2><p>{bdt(settings.delivery.dhaka)} inside Dhaka, {bdt(settings.delivery.outside)} outside. Free above {bdt(settings.delivery.freeAbove)}.</p></div>
  </div>;
}
