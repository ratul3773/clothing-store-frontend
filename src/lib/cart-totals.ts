import { COUPONS, DELIVERY, FREE_DELIVERY_THRESHOLD } from "@/lib/config";
import { effectivePrice, getProduct } from "@/lib/data/products";
import type { CartItem, DeliveryZone, Product } from "@/lib/types";

export interface ResolvedCartLine extends CartItem {
  product: Product;
  unitPrice: number;
  lineTotal: number;
  lineSavings: number;
}

export function resolveCartLines(items: CartItem[]): ResolvedCartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    if (!product) return [];
    const unitPrice = effectivePrice(product);
    return [
      {
        ...item,
        product,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        lineSavings: (product.price - unitPrice) * item.quantity,
      },
    ];
  });
}

export function calculateCartTotals(items: CartItem[]) {
  return computeTotals(resolveCartLines(items), null, "inside_dhaka");
}

export function computeTotals(
  lines: ResolvedCartLine[],
  couponCode: string | null,
  zone: DeliveryZone | null,
) {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const offerSavings = lines.reduce((sum, l) => sum + l.lineSavings, 0);
  const coupon = COUPONS.find((c) => c.code === couponCode);
  const couponValid = coupon ? subtotal >= coupon.minSubtotal : false;
  const couponDiscount =
    coupon && couponValid
      ? coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value
      : 0;
  const freeDelivery = subtotal - couponDiscount >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = zone ? (freeDelivery ? 0 : DELIVERY[zone].fee) : null;
  const total = subtotal - couponDiscount + (deliveryFee ?? 0);

  return {
    subtotal,
    itemCount,
    offerSavings,
    coupon,
    couponValid,
    couponDiscount,
    freeDelivery,
    amountToFreeDelivery: Math.max(
      0,
      FREE_DELIVERY_THRESHOLD - (subtotal - couponDiscount),
    ),
    deliveryFee,
    total,
  };
}
