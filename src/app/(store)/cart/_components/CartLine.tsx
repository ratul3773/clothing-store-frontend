"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import useQuantityDraft from "@/hooks/useQuantityDraft";
import { Button } from "@/components/ui/button";
import type { CartLineView } from "@/lib/cart-view";
import { bdt } from "@/lib/utils";

const statusLabels = {
  AVAILABLE: "",
  INSUFFICIENT_STOCK: "Not enough stock. Reduce the quantity to continue.",
  OUT_OF_STOCK: "Currently out of stock.",
  UNAVAILABLE: "This item is no longer available.",
};
type Props = {
  item: CartLineView;
  disabled: boolean;
  onUpdate: (id: string, quantity: number) => Promise<boolean>;
  onRemove: (id: string) => Promise<boolean>;
  onSelect: (ids: string[], selected: boolean) => void;
};

function CartLine({ item, disabled, onUpdate, onRemove, onSelect }: Props) {
  const { quantity, setQuantity, changed } = useQuantityDraft(item.id, item.quantity);
  const name = item.product?.name ?? "Unavailable item";
  const canSelect = item.status === "AVAILABLE";
  return (
    <article className="flex gap-3 border-b border-border py-5">
      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-accent" checked={item.selected} disabled={disabled || !canSelect} aria-label={`Select ${name}`} onChange={(event) => onSelect([item.id], event.target.checked)} />
      {item.product?.imageUrl ? <Image src={item.product.imageUrl} alt="" unoptimized width={88} height={112} className="h-28 w-20 shrink-0 rounded-sm bg-muted object-cover" /> : <div className="grid h-28 w-20 shrink-0 place-items-center rounded-sm bg-muted"><ShoppingBag size={24} aria-hidden="true" /></div>}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {item.product?.slug ? <Link href={`/p/${encodeURIComponent(item.product.slug)}`} className="font-semibold hover:underline">{name}</Link> : <p className="font-semibold">{name}</p>}
            {item.variant && <p className="mt-1 text-xs text-muted-foreground">{item.variant.color} / {item.variant.size}</p>}
          </div>
          <Button type="button" variant="destructive" disabled={disabled} onClick={() => void onRemove(item.id)} aria-label={`Remove ${name}`}><Trash2 className="text-destructive" size={16} /></Button>
        </div>
        {statusLabels[item.status] && <p className="text-xs text-destructive">{statusLabels[item.status]}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-foreground/30">
            <Button type="button" variant="ghost" size="icon-sm" disabled={disabled || quantity <= 1} aria-label={`Decrease quantity of ${name}`} className="rounded-full" onClick={() => setQuantity(quantity - 1)}><Minus size={13} /></Button>
            <span className="w-7 text-center text-sm" aria-label="Quantity">{quantity}</span>
            <Button type="button" variant="ghost" size="icon-sm" disabled={disabled} aria-label={`Increase quantity of ${name}`} className="rounded-full" onClick={() => setQuantity(quantity + 1)}><Plus size={13} /></Button>
          </div>
          {changed && <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant="accent" disabled={disabled} aria-label={`Update quantity of ${name}`} onClick={() => void onUpdate(item.id, quantity)}>Update</Button><span className="text-xs text-muted-foreground" role="status">Quantity not saved</span></div>}
          </div>
          {item.unitPrice !== null && <span className="text-sm font-semibold">{bdt(item.unitPrice * item.quantity)}</span>}
        </div>
      </div>
    </article>
  );
}

export default memo(CartLine);
