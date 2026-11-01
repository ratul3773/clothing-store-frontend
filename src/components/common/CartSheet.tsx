"use client";

import { Sheet } from "@/components/ui/sheeet";
import CartContents from "../../app/(store)/cart/_components/CartContents";

export default function CartSheet({ open, count, onOpenChange }: { open: boolean; count: number; onOpenChange: (value: boolean) => void }) {
  return <Sheet
    open={open}
    onOpenChange={onOpenChange}
    side="right"
    title={`Your bag (${count})`} description="Review and select items in your bag">
    {open && <CartContents drawer onNavigate={() => onOpenChange(false)} />
    }
  </Sheet>;
}