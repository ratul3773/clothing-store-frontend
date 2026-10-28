"use client";

import { Badge, Card, CardHeader } from "@/components/cms/ui";
import { bdt } from "@/lib/utils";
import type { Badge as BadgeValue, ProductStatus } from "@/redux/apis/types/product.types";

import { BADGE_TONES, STATUS_TONES } from "../_constants/products.constants";
import { statusLabel, toNumber } from "../_utils/products.utils";

type Props = {
  name: string;
  price: string;
  images: string[];
  badges: BadgeValue[];
  colors: Array<{ name: string; hex: string | null }>;
  status?: ProductStatus;
};

export default function ProductPreview({
  name,
  price,
  images,
  badges,
  colors,
  status,
}: Props) {
  const value = toNumber(price);
  const [primary] = images;

  return (
    <Card>
      <CardHeader
        title="Preview"
        description="How the product card can look in the store."
      />
      <div className="space-y-3 p-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded border border-border bg-muted">
          {primary ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primary} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No image yet
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((badge) => (
              <Badge key={badge} tone={BADGE_TONES[badge]}>
                {badge.replaceAll("_", " ")}
              </Badge>
            ))}
          </div>
          {status && (
            <div className="absolute right-2 top-2">
              <Badge tone={STATUS_TONES[status]}>{statusLabel(status)}</Badge>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto">
            {images.slice(0, 6).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="size-10 shrink-0 overflow-hidden rounded border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="size-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="truncate text-sm font-medium">{name || "Product name"}</p>
          <p className="text-sm font-semibold tabular-nums">
            {Number.isFinite(value) && value > 0 ? bdt(value) : "৳—"}
          </p>
        </div>

        {colors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {colors.map((color, index) => (
              <span
                key={`${color.name}-${index}`}
                title={color.name || `Colour ${index + 1}`}
                className="size-4 rounded-full border border-border"
                style={{ background: color.hex || "transparent" }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
