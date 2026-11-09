import type { PaginationQuery } from "../../api.utils";
import type { DeliveryZone } from "./address.types";
import type { ComboSelection } from "./combo.types";

export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNED"
  | "CANCELLED";
export type OrderSource =
  | "WEBSITE"
  | "ADMIN_MANUAL"
  | "WHATSAPP"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "PHONE";
export type OrderAddress = {
  recipientName: string;
  recipientPhone: string;
  district: string;
  area: string;
  addressLine: string;
  postalCode?: string | null;
  zone: DeliveryZone;
};
export type OrderTotals = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};
export type DeliveryPolicy = { inside: number; outside: number; freeAbove: number };
export type OrderComponent = {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  imageUrl?: string | null;
  color: string;
  size: string;
  quantity: number;
  returnedSellable?: number;
  returnedDamaged?: number;
};
export type OrderLine = {
  id: string;
  type: "VARIANT" | "COMBO";
  catalogId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string | null;
  components: OrderComponent[];
};
export type OrderDisplay = OrderAddress & OrderTotals & { lines: OrderLine[] };
export type OrderHistory = {
  id: string;
  event: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  createdAt: string;
  actorType?: string;
  actorId?: string | null;
  actor?: { name: string; email: string } | null;
  reason?: string | null;
};
export type OrderSummary = OrderTotals & {
  id: string;
  number: string;
  customerId: string | null;
  source: OrderSource;
  status: OrderStatus;
  version: number;
  recipientName: string;
  recipientPhone: string;
  paymentMethod: "COD";
  paidAt: string | null;
  expiresAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
};
export type OrderReceipt = OrderSummary &
  OrderAddress & {
    note: string | null;
    lines: OrderLine[];
    history: OrderHistory[];
    guestToken?: string;
    createdById?: string | null;
  };
export type OrderDestination =
  | { address: OrderAddress }
  | { addressId: string };
export type CheckoutSelection = { id: string; type: "VARIANT" | "COMBO" };
export type CheckoutPayload = {
  lines: CheckoutSelection[];
  version: number;
  destination: OrderDestination;
  note?: string;
  expected: OrderTotals;
};
export type ManualLine =
  | { type: "VARIANT"; variantId: string; quantity: number }
  | {
      type: "COMBO";
      comboId: string;
      quantity: number;
      selections: ComboSelection[];
    };
export type ManualOrderPayload = {
  lines: ManualLine[];
  destination: OrderDestination;
  customerId?: string;
  source: Exclude<OrderSource, "WEBSITE">;
  status: "PENDING_CONFIRMATION" | "CONFIRMED";
  discount: number;
  deliveryOverride?: number;
  adjustmentReason?: string;
  note?: string;
  expected: OrderTotals;
};
export type OrderQuery = PaginationQuery & {
  status?: OrderStatus;
  source?: OrderSource;
  q?: string;
  from?: string;
  to?: string;
};
export type CustomerOption = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};
export type OrderAccess = { id: string; owner: string; guest?: boolean };
export type ReturnInspection = {
  id: string;
  sellable: number;
  damaged: number;
};
