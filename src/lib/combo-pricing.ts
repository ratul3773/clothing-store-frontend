import type { ComboComponent } from "@/redux/apis/types/combo.types";

export const comboDraftPricing = (items: ComboComponent[], price: number) => {
  const combinedPrice = items.reduce((sum, item) => sum + item.product.unitPrice * item.quantity, 0);
  const savings = Number.isFinite(price) ? Math.max(0, combinedPrice - price) : 0;
  return { combinedPrice, savings, discountPercentage: combinedPrice > 0 ? Math.round(savings / combinedPrice * 10_000) / 100 : 0 };
};

export const comboDiscountLabel = (percentage: number) => percentage > 0 ? `${percentage}% off` : "<0.01% off";
