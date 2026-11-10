import type { CartItem } from "@/redux/apis/types/cart.types";
import type { PublicProduct } from "@/redux/apis/types/product.types";
import type { DeliveryPolicy, ManualLine, OrderLine, OrderTotals } from "@/redux/apis/types/order.types";

export function orderTotals(subtotal: number, zone: string, policy: DeliveryPolicy, discount = 0, deliveryOverride?: number): OrderTotals {
  const deliveryFee = deliveryOverride ?? (subtotal >= policy.freeAbove ? 0 : zone === "INSIDE_DHAKA" ? policy.inside : policy.outside);
  return { subtotal, discount, deliveryFee, total: subtotal - discount + deliveryFee };
}

export function cartOrderLines(items: CartItem[]): OrderLine[] {
  return items.map((item) => ({
    id: item.id, type: item.type, catalogId: item.type === "COMBO" ? item.comboId! : item.variantId,
    name: item.type === "COMBO" ? item.combo!.name : item.product!.name,
    quantity: item.quantity, unitPrice: item.unitPrice!,
    imageUrl: item.type === "COMBO" ? item.combo!.imageUrl : item.product!.imageUrl,
    components: item.type === "COMBO" ? item.combo!.items.map((component) => {
      const selected = item.selections.find((selection) => selection.comboItemId === component.id)!;
      return { id: component.id, variantId: selected.variantId, sku: "", productName: component.product.name,
        imageUrl: component.product.imageUrl, color: component.color.name, size: selected.size, quantity: component.quantity * item.quantity };
    }) : [{ id: item.id, variantId: item.variantId, sku: "", productName: item.product!.name,
      imageUrl: item.product!.imageUrl, color: item.variant!.color, size: item.variant!.size, quantity: item.quantity }],
  }));
}

export function manualOrderLines(lines: ManualLine[], catalogs: Record<string, PublicProduct>): OrderLine[] {
  return lines.flatMap((line, index) => {
    const product = Object.values(catalogs).find((item) => line.type === "COMBO"
      ? item.type === "COMBO" && item.comboId === line.comboId
      : item.variants.some((variant) => variant.id === line.variantId));
    if (!product) return [];
    const components = line.type === "COMBO" && product.type === "COMBO" ? product.items.flatMap((item) => {
      const selection = line.selections.find((selected) => selected.comboItemId === item.id);
      const variant = item.variants.find((variant) => variant.id === selection?.variantId);
      return variant ? [{ id: item.id, variantId: variant.id, sku: "", productName: item.product.name, imageUrl: item.product.imageUrl,
        color: item.color.name, size: variant.size, quantity: item.quantity * line.quantity }] : [];
    }) : line.type === "VARIANT" ? product.variants.filter((variant) => variant.id === line.variantId).map((variant) => ({
      id: variant.id, variantId: variant.id, sku: "", productName: product.name,
      imageUrl: product.images.find((image) => image.colorId === variant.colorId)?.url ?? product.images[0]?.url ?? null,
      color: variant.colorName, size: variant.size, quantity: line.quantity,
    })) : [];
    if (components.length !== (product.type === "COMBO" ? product.items.length : 1)) return [];
    return [{ id: String(index), type: line.type, catalogId: product.id, name: product.name, quantity: line.quantity,
      unitPrice: product.effectivePrice, imageUrl: components.find((item) => item.imageUrl)?.imageUrl ?? product.images[0]?.url ?? null, components }];
  });
}
