"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartLine from "./CartLine";
import CartSkeleton from "./CartSkeleton";
import useCart from "@/hooks/useCart";
import { useCallback } from "react";
import { bdt } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import AlertDialogText from "@/components/common/Alert-Dialogue";
import PaginationComponent from "@/components/common/Pagination";

export default function CartContents({ drawer = false, onNavigate }: { drawer?: boolean; onNavigate?: () => void }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { cart, edit, setSelection, reload, retrySession } = useCart({ page, itemsPerPage });
  const update = useCallback((id: string, quantity: number) => edit({ type: "quantity", id, quantity }), [edit]);
  const remove = useCallback((id: string) => edit({ type: "remove", id }), [edit]);
  const selectAll = useRef<HTMLInputElement>(null);
  const disabled = !cart.ready || cart.loading || cart.busy;
  const showSkeleton = !cart.lines.length && (cart.mode === "resolving" || (
    (cart.mode === "guest" || cart.mode === "account") && !cart.error && (!cart.ready || cart.loading)
  ));
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  useEffect(() => {
    if (selectAll.current) selectAll.current.indeterminate = cart.selectedCount > 0 && !cart.allSelected;
  }, [cart.selectedCount, cart.allSelected]);

  return (
    <>
    <div className={drawer ? "flex min-h-0 flex-1 flex-col" : "mt-6"}>
      <div className={drawer ? "space-y-2 px-5 py-2 text-xs" : "mb-5 space-y-2 text-sm"}>
        {cart.mode === "restricted" && 
        <p role="status">Bags are available to verified customer accounts. Verify your email or sign in with a customer account.
        </p>
        }
        {cart.mode === "session-error" && 
        <div role="alert">
          <p>{cart.error || "We could not verify your session. Your guest bag has not been changed."}
          </p>
          <Button 
          size="sm" 
          variant="outline" 
          className="mt-2" 
          onClick={() => void retrySession()}
          >Retry session
          </Button>
          </div>
          }
        {cart.error && cart.mode !== "session-error" && 
        <div role="alert">
          <p className="text-destructive">{cart.error}
            </p>
            <Button 
            size="sm" 
            variant="outline" 
            className="mt-2" 
            disabled={cart.loading || cart.busy} 
            onClick={() => void reload()}
            >{cart.mode === "guest" ? "Dismiss" : "Reload bag"}
            </Button></div>}
        <p role="status" aria-live="polite" className={cart.loading ? "sr-only" : "text-muted-foreground"}>{!showSkeleton && cart.loading ? "Loading your bag…" : cart.busy ? "Saving your bag…" : ""}</p>
      </div>

      {showSkeleton && <CartSkeleton drawer={drawer} />}

      {!showSkeleton && cart.ready && !cart.lines.length &&
      <div className="grid place-items-center py-16 text-center">
        <ShoppingBag size={30} className="text-muted-foreground" />
        <h2 className="mt-4 font-display text-2xl">Your bag is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">Find something you love.</p>
        <Button to="/shop" className="mt-6" onClick={onNavigate}>Explore the shop</Button>
        </div>
        }

      {cart.lines.length > 0 && 
      <div className={drawer ? "flex min-h-0 flex-1 flex-col" : "grid items-start gap-8 lg:grid-cols-[1fr_22rem]"}>
        <section aria-label="Cart items" className={drawer ? "min-h-0 flex-1 overflow-y-auto px-5" : "min-w-0"}>
          <div className="flex items-center justify-between gap-3 border-b border-border py-3 text-sm">
            <label className="flex items-center gap-2">
              <Input 
              ref={selectAll} 
              type="checkbox" 
              className="size-4 accent-accent" 
              checked={cart.allSelected} 
              disabled={disabled || !cart.eligibleIds.length} 
              onChange={(event) => setSelection(cart.eligibleIds, event.target.checked)} />Select all
            </label>
            <Button 
            type="button"
            variant="destructive"
            size="sm"
            className="border-none"
            disabled={disabled} onClick={() => setDeleteAllConfirm(true)}>
              Clear bag
            </Button>
          </div>
          {cart.lines.map((item) =>
          <CartLine key={`${cart.identityKey}:${item.id}`} item={item} disabled={disabled} onUpdate={update} onRemove={remove} onSelect={setSelection} />)}
          {!drawer && cart.pagination && <PaginationComponent
            showPageNumbers={!drawer}
            paginationInfo={{
              ...cart.pagination,
              showingStart: (cart.pagination.currentPage - 1) * itemsPerPage + 1,
              showingEnd: Math.min(cart.pagination.currentPage * itemsPerPage, cart.pagination.totalItems),
            }}
            onPageChange={setPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setPage(1);
            }}
          />}
        </section>
        <aside className={drawer ? "space-y-3 border-t border-border p-5" : "space-y-4 border border-border p-5"}>
          <div className="flex justify-between gap-3 text-sm"><span>Selected subtotal ({cart.selectedCount})</span><b>{bdt(cart.selectedSubtotal)}</b></div>
          <p className="text-xs text-muted-foreground">Prices are current server values. Delivery and discounts are not included, and items in your bag do not reserve stock.</p>
          <p className="text-xs text-muted-foreground">Quantity changes are saved only after you click Update. Your subtotal uses saved quantities.</p>
          <Button variant="accent" className="w-full" disabled>Checkout coming soon</Button>
          {!cart.selectedCount && <p className="text-xs text-muted-foreground">Select an available item to prepare your bag.</p>}
          {drawer ? <Button to="/cart" variant="outline" className="w-full" onClick={onNavigate}>View cart</Button> : <Button to="/shop" variant="outline" className="w-full">Continue shopping</Button>}
        </aside>
      </div>}
    </div>
    <AlertDialogText 
     open={deleteAllConfirm}
     onOpenChange={setDeleteAllConfirm}
     title="Clear bag"
     description="Are you sure you want to remove all items from your bag?"
     actionType="delete"
     onConfirm={() => {
      edit({ type: "clear" });
      setDeleteAllConfirm(false);
     }}
    />
    </>
  );
}
