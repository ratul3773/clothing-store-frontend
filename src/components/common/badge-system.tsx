import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Availability, OrderStatus, ProductBadge } from "@/lib/types";

const tagVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-sm px-2 text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.1em] whitespace-nowrap",
  {
    variants: {
      tone: {
        brand: "bg-primary text-primary-foreground",
        sale: "bg-destructive text-destructive-foreground",
        bestseller: "bg-accent text-accent-foreground",
        neutral: "bg-card text-foreground ring-1 ring-border",
        success: "bg-success/12 text-success",
        warning: "bg-warning/18 text-foreground",
        info: "bg-info/12 text-info",
        danger: "bg-destructive/10 text-destructive",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Tag({
  tone,
  className,
  children,
  dot,
}: VariantProps<typeof tagVariants> & {
  className?: string;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span className={cn(tagVariants({ tone }), className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const badgeMap: Record<
  ProductBadge,
  { label: string; tone: VariantProps<typeof tagVariants>["tone"] }
> = {
  new: { label: "New", tone: "brand" },
  sale: { label: "Sale", tone: "sale" },
  best_seller: { label: "Best seller", tone: "bestseller" },
};

export function ProductBadgeTag({ badge }: { badge: ProductBadge }) {
  const { label, tone } = badgeMap[badge];
  return <Tag tone={tone}>{label}</Tag>;
}

export function AvailabilityText({
  availability,
  stockLeft,
  className,
}: {
  availability: Availability;
  stockLeft?: number;
  className?: string;
}) {
  const map = {
    in_stock: { label: "In stock", className: "text-success" },
    low_stock: {
      label: stockLeft ? `Only ${stockLeft} left` : "Low stock",
      className: "text-warning-foreground dark:text-warning",
    },
    out_of_stock: { label: "Out of stock", className: "text-muted-foreground" },
  }[availability];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        map.className,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          availability === "in_stock" && "bg-success",
          availability === "low_stock" && "bg-warning",
          availability === "out_of_stock" && "bg-muted-foreground/60",
        )}
      />
      {map.label}
    </span>
  );
}

const orderStatusMap: Record<
  OrderStatus,
  { label: string; tone: VariantProps<typeof tagVariants>["tone"] }
> = {
  placed: { label: "Placed", tone: "muted" },
  confirmed: { label: "Confirmed", tone: "info" },
  shipped: { label: "Shipped", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

export function OrderStatusTag({ status }: { status: OrderStatus }) {
  const { label, tone } = orderStatusMap[status];
  return (
    <Tag tone={tone} dot>
      {label}
    </Tag>
  );
}
