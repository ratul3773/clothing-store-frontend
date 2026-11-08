import OrderReceipt from "@/components/common/OrderReceipt";
import type { OrderDisplay } from "@/redux/apis/types/order.types";

export default function OrderSummary({
  order,
}: {
  order: OrderDisplay | null;
}) {
  return (
    <aside className="space-y-4 border border-border p-5">
      <h2 className="font-display text-xl">Your order</h2>
      {order ? (
        <OrderReceipt order={order} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Loading selected items and delivery charges.
        </p>
      )}
    </aside>
  );
}
