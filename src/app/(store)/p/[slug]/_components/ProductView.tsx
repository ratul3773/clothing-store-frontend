"use client";

import { useEffect } from "react";
import Link from "next/link";
import ComboInfo from "./ComboInfo";
import useProductPurchase from "@/app/(store)/p/[slug]/_hooks/useProductPurchase";
import ProductGallery from "@/app/(store)/p/[slug]/_components/ProductGallery";
import ProductInfo from "@/app/(store)/p/[slug]/_components/ProductInfo";
import CompleteTheLook from "@/app/(store)/p/[slug]/_components/CompleteTheLook";
import RecentlyViewed from "@/app/(store)/p/[slug]/_components/RecentlyViewed";
import { categoryLabel } from "@/lib/storefront";

import type { Product } from "@/data/catalog";
import { useRecentlyViewed } from "../_hooks/useRecentlyViewed";

export default function ProductView({ p }: { p: Product }) {
  const { push } = useRecentlyViewed();
  useEffect(() => {
    if (p) push(p.id);
  }, [p?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return p.type === "COMBO" ? (
    <ComboView p={p} />
  ) : (
    <OrdinaryProductView p={p} />
  );
}

function OrdinaryProductView({ p }: { p: Product }) {
  const s = useProductPurchase(p);
  return (
    <div>
      <p className="label-mono mb-6 text-muted-foreground">
        <Link href="/shop" className="hover:text-accent">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          href={`/shop?cat=${encodeURIComponent(p.category ?? "")}`}
          className="hover:text-accent"
        >
          {p.custom ? p.sub : categoryLabel(p.category ?? "")}
        </Link>{" "}
        / {p.sku}
      </p>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ProductGallery p={p} color={s.color} onSelect={s.selectColor} />
        <ProductInfo p={p} s={s} />
      </div>
      <CompleteTheLook p={p} />
      <RecentlyViewed currentId={p.id} />
    </div>
  );
}

function ComboView({ p }: { p: Product }) {
  return (
    <div>
      <p className="label-mono mb-6 text-muted-foreground">
        <Link href="/shop">Shop</Link> / Combos / {p.name}
      </p>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ProductGallery p={p} />
        <ComboInfo p={p} />
      </div>
      <RecentlyViewed currentId={p.id} />
    </div>
  );
}
