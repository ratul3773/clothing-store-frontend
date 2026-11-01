"use client";

import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartSheet from "@/components/common/CartSheet";
import useCart from "@/hooks/useCart";
import { OPEN_CART_EVENT } from "@/lib/cart-ui";

function CartButton() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const reveal = () => setOpen(true);
    window.addEventListener(OPEN_CART_EVENT, reveal);
    return () => window.removeEventListener(OPEN_CART_EVENT, reveal);
  }, []);
  return <>
    <Button onClick={() => setOpen(true)} aria-label={`Cart, ${cart.count} items`} size="icon" variant="outline" className="h-10 w-10 border-none place-items-center rounded-full">
      <ShoppingBag size={18} />
      <AnimatePresence mode="popLayout">{cart.count > 0 && <motion.span key={cart.count} initial={{ scale: 0.4, y: -8 }} animate={{ scale: 1, y: 0 }} className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{cart.count}</motion.span>}</AnimatePresence>
    </Button>
    <CartSheet open={open} count={cart.count} onOpenChange={setOpen} />
  </>;
}

export default memo(CartButton);
