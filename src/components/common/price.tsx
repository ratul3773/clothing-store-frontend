import { cn } from "@/lib/utils";
import { discountPercent, formatBDT } from "@/lib/format/currency";

interface PriceProps {
  price: number;
  offerPrice?: number;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function Price({
  price,
  offerPrice,
  size = "md",
  showDiscount = true,
  className,
}: PriceProps) {
  const discount = discountPercent(price, offerPrice);
  const onSale = discount > 0;

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        className,
      )}
    >
      <span
        className={cn(
          "type-price",
          sizeClass[size],
          onSale && "text-destructive",
        )}
      >
        <span className="sr-only">{onSale ? "Sale price " : "Price "}</span>
        {formatBDT(onSale ? offerPrice! : price)}
      </span>
      {onSale && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through tabular-nums",
              size === "lg" ? "text-base" : "text-sm",
            )}
          >
            <span className="sr-only">Regular price </span>
            {formatBDT(price)}
          </span>
          {showDiscount && (
            <span className="text-xs font-semibold tabular-nums text-destructive">
              {`−${discount}%`}
            </span>
          )}
        </>
      )}
    </p>
  );
}
