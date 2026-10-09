import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Price } from "./price";
import { AvailabilityText, ProductBadgeTag } from "./badge-system";
import { WishlistButton } from "./wishlist-button";

interface ProductCardProps {
  product: Product;
  /** compact: tighter type for carousels and complete-the-look */
  variant?: "default" | "compact";
  priority?: boolean;
  /** Optional slot rendered under the card body, e.g. wishlist actions */
  footer?: ReactNode;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  priority,
  footer,
  className,
}: ProductCardProps) {
  const soldOut = product.availability === "out_of_stock";
  const primaryBadge = product.badges.includes("sale")
    ? "sale"
    : product.badges[0];
  const href = `/product/${product.slug}`;

  return (
    <article
      className={cn("group/card relative flex flex-col gap-3", className)}
    >
      <div className="relative overflow-hidden rounded-lg bg-surface">
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <div className="relative aspect-[4/5]">
            <Image
              data-product-image
              src={product.images[0] || "/placeholder.svg"}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
              className={cn(
                "object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]",
                soldOut && "opacity-55 grayscale-[35%]",
              )}
            />
            {product.images[1] && (
              <Image
                data-product-image
                src={product.images[1] || "/placeholder.svg"}
                alt=""
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
              />
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {soldOut ? (
              <span className="inline-flex h-6 items-center rounded-sm bg-foreground px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-background">
                Sold out
              </span>
            ) : (
              primaryBadge && <ProductBadgeTag badge={primaryBadge} />
            )}
          </div>
          <div className="pointer-events-auto">
            <WishlistButton slug={product.slug} name={product.name} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-xs text-muted-foreground">{product.fit}</p>
        <h3
          className={cn(
            "font-medium leading-snug text-pretty",
            variant === "compact" ? "text-sm" : "text-sm md:text-base",
          )}
        >
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <Price
          price={product.price}
          offerPrice={product.offerPrice}
          size="sm"
        />
        {variant === "default" && (
          <div className="mt-1 flex items-center justify-between gap-2">
            <ul
              className="flex items-center gap-1"
              aria-label={`${product.colors.length} colours`}
            >
              {product.colors.map((color) => (
                <li
                  key={color.name}
                  title={color.name}
                  className="size-3.5 rounded-full ring-1 ring-foreground/15 ring-offset-1 ring-offset-background"
                  style={{ backgroundColor: color.swatch }}
                >
                  <span className="sr-only">{color.name}</span>
                </li>
              ))}
            </ul>
            {product.availability !== "in_stock" && (
              <AvailabilityText
                availability={product.availability}
                stockLeft={product.stockLeft}
              />
            )}
          </div>
        )}
      </div>
      {footer && <div className="relative z-10">{footer}</div>}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-ring ring-offset-4 ring-offset-background opacity-0 group-has-[a:focus-visible]/card:opacity-100"
      />
    </article>
  );
}

export function ProductCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="aspect-[4/5] w-full rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-20" />
        {variant === "default" && (
          <Skeleton className="mt-1 h-3.5 w-12 rounded-full" />
        )}
      </div>
    </div>
  );
}
