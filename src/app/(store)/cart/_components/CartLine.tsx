"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import useQuantityDraft from "@/hooks/useQuantityDraft";
import { Button } from "@/components/ui/button";
import type { CartLineView } from "@/lib/cart-view";
import ComboComponents from "@/components/common/ComboComponents";
import { comboHref } from "@/lib/productHref";
import { bdt } from "@/lib/utils";
import { comboDiscountLabel } from "@/lib/combo-pricing";

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
  const details = item.type === "COMBO" ? item.combo : item.product;
  const name = details?.name ?? "Unavailable item";
  const href = details ? item.type === "COMBO" ? comboHref(details.slug) : `/p/${encodeURIComponent(details.slug)}` : null;
  const canSelect = item.status === "AVAILABLE";
  return (
    <article className="flex gap-3 border-b border-border py-5">
      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-accent" checked={item.selected} disabled={disabled || !canSelect} aria-label={`Select ${name}`} onChange={(event) => onSelect([item.id], event.target.checked)} />
      {details?.imageUrl ? <Image src={details.imageUrl} alt="" unoptimized width={88} height={112} className="h-28 w-20 shrink-0 rounded-sm bg-muted object-cover" /> : <div className="grid h-28 w-20 shrink-0 place-items-center rounded-sm bg-muted"><ShoppingBag size={24} aria-hidden="true" /></div>}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {href ? <Link href={href} className="font-semibold hover:underline">{name}</Link> : <p className="font-semibold">{name}</p>}
            {item.type === "COMBO" && item.combo && <><p className="text-xs font-semibold">Combo</p><ComboComponents items={item.combo.items} selections={item.selections} compact /></>}
            {item.type === "COMBO" && item.requiresSelection && href && <p className="text-xs text-destructive">This saved combo needs size selections. <Link href={href} className="underline">Choose sizes and add it again</Link>, then remove this line.</p>}
            {item.type === "COMBO" && item.combo && item.combo.savings > 0 && <p className="mt-1 text-xs text-success">Save {bdt(item.combo.savings)} per combo ({comboDiscountLabel(item.combo.discountPercentage)})</p>}
            {item.variant && <p className="mt-1 text-xs text-muted-foreground">{item.variant.color} / {item.variant.size}</p>}
          </div>
          <Button type="button" size="icon" variant="destructive" className="border-none" disabled={disabled} onClick={() => void onRemove(item.id)} aria-label={`Remove ${name}`}><Trash2 size={16} /></Button>
        </div>
        {statusLabels[item.status] && <p className="text-xs text-destructive">{statusLabels[item.status]}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-foreground/30">
            <Button type="button" variant="ghost" size="icon-sm" disabled={disabled || quantity <= 1} aria-label={`Decrease quantity of ${name}`} className="rounded-full" onClick={() => setQuantity(quantity - 1)}><Minus size={13} /></Button>
            <span className="w-7 text-center text-sm" aria-label="Quantity">{quantity}</span>
            <Button type="button" variant="ghost" size="icon-sm" disabled={disabled || quantity >= Math.min(50, item.maxQuantity)} aria-label={`Increase quantity of ${name}`} className="rounded-full" onClick={() => setQuantity(quantity + 1)}><Plus size={13} /></Button>
          </div>
          {changed && <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant="accent" disabled={disabled} aria-label={`Update quantity of ${name}`} onClick={() => void onUpdate(item.id, quantity)}>Update</Button><span className="text-xs text-muted-foreground" role="status">Quantity not saved</span></div>}
          </div>
          {item.lineSubtotal !== null && <span className="text-sm font-semibold">{bdt(item.lineSubtotal)}</span>}
        </div>
      </div>
    </article>
  );
}

export default memo(CartLine);
