import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { orderLabel } from "@/lib/order-rules";
import { OrderStatus } from "@/redux/apis/types/order.types";

const tone: Record<
  OrderStatus | "DELIVERY_FAILED",
  ComponentProps<typeof Badge>["variant"]
> = {
  PENDING_CONFIRMATION: "warning",
  CONFIRMED: "accent",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "destructive",
  RETURNED: "destructive",
  DELIVERY_FAILED: "destructive",
};

export default function StatusBadge({
  status,
}: {
  status: OrderStatus | "DELIVERY_FAILED";
}) {
  return (
    <Badge variant={tone[status]}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      {orderLabel(status)}
    </Badge>
  );
}
