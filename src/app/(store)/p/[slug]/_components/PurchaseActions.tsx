"use client";

import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeArc } from "@/components/animation/fade-arc";

interface Props {
  qty: number;
  liked: boolean;
  onDec: () => void;
  onInc: () => void;
  onAdd: () => void;
  onWish: () => void;
  canAdd: boolean;
  canIncrease: boolean;
  canDecrease: boolean;
  adding: boolean;
  isInCart: boolean;
}

export default function PurchaseActions({
  qty,
  liked,
  onDec,
  onInc,
  onAdd,
  onWish,
  canAdd,
  canIncrease,
  canDecrease,
  adding,
  isInCart,
}: Props) {
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center rounded-[3px] border border-foreground/40">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canDecrease || adding}
            aria-label="Less"
            className="h-full w-11 self-stretch rounded-none disabled:opacity-30"
            onClick={onDec}
          >
            <Minus size={15} />
          </Button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canIncrease || adding}
            aria-label="More"
            className="h-full w-11 self-stretch rounded-none disabled:opacity-30"
            onClick={onInc}
          >
            <Plus size={15} />
          </Button>
        </div>
        <Button size="lg" disabled={!canAdd} onClick={onAdd}>
          {adding ? (
            <div className="flex items-center gap-2">
              <FadeArc className="size-5" />
              {isInCart ? "Updating..." : "Adding..."}
            </div>
          ) : isInCart ? (
            "Update cart"
          ) : (
            "Add to bag"
          )}
        </Button>
        <Button size="lg" variant="accent" disabled>
          Checkout coming soon
        </Button>
        <Button
          aria-label="Wishlist"
          variant="outline"
          size="icon"
          onClick={onWish}
          className="grid h-10 w-10 place-items-center rounded-[3px] border border-foreground/40 transition hover:bg-foreground hover:text-background"
        >
          <Heart size={20} className={cn(liked && "fill-accent text-accent")} />
        </Button>
      </div>
    </>
  );
}
