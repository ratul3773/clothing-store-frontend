import { useMemo } from "react";
import type { ComboComponent } from "@/redux/apis/types/combo.types";
import { bdt } from "@/lib/utils";
import { comboDraftPricing, comboDiscountLabel } from "@/lib/combo-pricing";

export default function ComboPricingSummary({
  items,
  price,
}: {
  items: ComboComponent[];
  price: string;
}) {
  const pricing = useMemo(
    () => comboDraftPricing(items, Number(price)),
    [items, price],
  );
  if (!items.length) return null;
  if (!Number.isFinite(pricing.combinedPrice))
    return (
      <p className="text-sm text-muted-foreground">
        Enter component quantities to see pricing.
      </p>
    );
  return (
    <div
      className="rounded border border-border bg-muted p-3 text-sm"
      aria-live="polite"
    >
      <p>
        Combined item price: <strong>{bdt(pricing.combinedPrice)}</strong>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Includes quantities and current product offers.
      </p>
      {Number(price) > 0 && pricing.savings > 0 && (
        <p className="mt-2 text-success">
          Save {bdt(pricing.savings)} (
          {comboDiscountLabel(pricing.discountPercentage)})
        </p>
      )}
    </div>
  );
}
