import type { OrderStatus } from "@/redux/apis/types/order.types";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "DELIVERY_FAILED",
  "RETURNED",
  "CANCELLED",
];
export const ORDER_SOURCES = [
  "WEBSITE",
  "ADMIN_MANUAL",
  "WHATSAPP",
  "FACEBOOK",
  "INSTAGRAM",
  "PHONE",
] as const;
export const orderLabel = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
export const nextOrderStatuses = (status: OrderStatus): OrderStatus[] =>
  (
    ({
      PENDING_CONFIRMATION: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPED"],
      SHIPPED: ["DELIVERED", "DELIVERY_FAILED"],
      DELIVERY_FAILED: ["RETURNED"],
      DELIVERED: [],
      RETURNED: [],
      CANCELLED: [],
    }) as Record<OrderStatus, OrderStatus[]>
  )[status];
export const dhakaDateBoundary = (day: string, end = false) =>
  new Date(
    `${day}T${end ? "23:59:59.999" : "00:00:00.000"}+06:00`,
  ).toISOString();

export const orderErrorStatus = (error: unknown) =>
  error && typeof error === "object" && "status" in error
    ? error.status
    : undefined;
// A 5xx or transport failure can arrive after a commit; retry the original key.
export const isUncertainOrderError = (error: unknown) => {
  const status = orderErrorStatus(error);
  return typeof status !== "number" || status >= 500 || status === 401 || status === 403 || status === 429;
};
