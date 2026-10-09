"use client";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Truck,
} from "lucide-react";
import { StoreShell } from "@/components/layout/site-header";
import { Price } from "@/components/common/price";
import { RatingStars } from "@/components/common/rating";
import { ProductCard } from "@/components/common/product-card";
import { products } from "@/lib/data/products";
import { useAppDispatch } from "@/lib/redux/store";
import { addItem } from "@/lib/redux/slices/cart-slice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [size, setSize] = useState(product?.sizes[1] ?? product?.sizes[0]);
  const [color, setColor] = useState(product?.colors[0]?.name);
  const [qty, setQty] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const dispatch = useAppDispatch();

  const visibleThumbnails = product?.images.slice(
    thumbnailStart,
    thumbnailStart + 5,
  );

  function selectImage(index: number) {
    setSelectedImageIndex(index);

    if (index < thumbnailStart) {
      setThumbnailStart(index);
    } else if (index >= thumbnailStart + 4) {
      setThumbnailStart(Math.min(index - 3, (product?.images.length ?? 1) - 4));
    }
  }

  function showPreviousThumbnailGroup() {
    setThumbnailStart((current) => Math.max(0, current - 1));
  }

  function showNextThumbnailGroup() {
    setThumbnailStart((current) =>
      Math.min(current + 1, Math.max(0, (product?.images.length ?? 1) - 4)),
    );
  }
  if (!product) return notFound();
  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-sm text-muted-foreground">
          <Link href="/shop">Shop</Link>
          <span className="mx-2">/</span>
          {product.name}
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="grid max-w-5xl grid-cols-[72px_minmax(0,1fr)] gap-3 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-4">
            <div className="relative flex h-[38rem] flex-col items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={showPreviousThumbnailGroup}
                disabled={thumbnailStart === 0}
                aria-label="Show previous product images"
                className="size-8 shrink-0"
              >
                <ChevronUp data-icon="inline-start" />
              </Button>
              <div className="relative h-[30rem] w-full shrink-0 overflow-hidden">
                <div className="flex flex-col gap-2">
                  {visibleThumbnails?.map((image, visibleIndex) => {
                    const imageIndex = thumbnailStart + visibleIndex;
                    const isSelected = imageIndex === selectedImageIndex;

                    return (
                      <div
                        key={image}
                        className={`relative h-24 w-full shrink-0 overflow-hidden bg-surface sm:h-28 ${
                          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                      >
                        <Image
                          src={image}
                          fill
                          alt={`${product.name} thumbnail ${imageIndex + 1}`}
                          className={`object-cover transition-opacity ${
                            isSelected
                              ? "opacity-100"
                              : "opacity-65 hover:opacity-100"
                          }`}
                          sizes="88px"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => selectImage(imageIndex)}
                          aria-label={`Show ${product.name} image ${imageIndex + 1}`}
                          aria-current={isSelected}
                          className="absolute inset-0 size-full rounded-none p-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={showNextThumbnailGroup}
                disabled={thumbnailStart >= product.images.length - 4}
                aria-label="Show next product images"
                className="size-8 shrink-0"
              >
                <ChevronDown data-icon="inline-start" />
              </Button>
            </div>
            <div className="relative aspect-[4/5] max-h-[38rem] bg-surface">
              <Image
                src={product.images[selectedImageIndex]}
                fill
                priority
                alt={product.name}
                className="object-cover"
                sizes="(min-width: 1024px) 48vw, calc(100vw - 8rem)"
              />
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm text-muted-foreground">
              {product.fit} · {product.fabric}
            </p>
            <h1 className="mt-2 font-display text-5xl font-black leading-none tracking-[-0.06em] text-primary">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <Price
                price={product.price}
                offerPrice={product.offerPrice}
                size="lg"
              />
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </div>
            <p className="mt-6 leading-7 text-muted-foreground">
              {product.shortDescription}
            </p>
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">
                  Colour{" "}
                  <span className="font-normal text-muted-foreground">
                    {color}
                  </span>
                </span>
              </div>
              <div className="mt-3 flex gap-3">
                {product.colors.map((c) => (
                  <Button
                    key={c.name}
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={c.name}
                    onClick={() => setColor(c.name)}
                    className={`size-8 rounded-full ring-offset-2 ${color === c.name ? "ring-2 ring-primary" : ""}`}
                    style={{ backgroundColor: c.swatch }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Size</span>
                <Link
                  href="/about#sizing"
                  className="text-xs font-semibold underline underline-offset-4"
                >
                  Size guide
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={size === s ? "default" : "outline"}
                    disabled={product.unavailableSizes.includes(s)}
                    onClick={() => setSize(s)}
                    className="h-11"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-7 flex gap-3">
              <div className="flex h-11 items-center border border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-none"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus data-icon="inline-start" />
                </Button>
                <span className="w-6 text-center text-sm">{qty}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-none"
                  onClick={() => setQty(Math.min(5, qty + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus data-icon="inline-start" />
                </Button>
              </div>
              <Button
                className="h-11 flex-1"
                onClick={() =>
                  dispatch(
                    addItem({
                      slug: product.slug,
                      color: color!,
                      size: size!,
                      quantity: qty,
                    }),
                  )
                }
              >
                Add to bag
              </Button>
            </div>
            <div className="mt-7 grid gap-3 border-y border-border py-5 text-sm">
              <p className="flex items-center gap-3">
                <Truck className="size-4 text-primary" /> Delivery in 2–4
                working days
              </p>
              <p className="flex items-center gap-3">
                <Check className="size-4 text-success" /> Easy exchange within 7
                days
              </p>
            </div>
          </div>
        </div>
        <Tabs
          defaultValue="details"
          className="mt-12 border-t border-border pt-8"
        >
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-5">
            <ul className="grid gap-2 text-sm text-muted-foreground">
              {product.details.map((d) => (
                <li key={d}>— {d}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="specs" className="mt-5">
            <dl className="grid gap-3 text-sm">
              {product.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between border-b border-border pb-2"
                >
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
        </Tabs>
        <section className="mt-12 border-t border-border pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Styled together
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-primary">
                Complete your look
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                {`Pair this ${product.category === "shirts" ? "shirt" : "pant"} with a recommended ${product.category === "shirts" ? "pant" : "shirt"}.`}
              </p>
            </div>
            <Link
              href={`/shop?category=${product.category === "shirts" ? "pants" : "shirts"}`}
              className="text-sm font-semibold underline underline-offset-4"
            >
              Shop {product.category === "shirts" ? "pants" : "shirts"}
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3">
            {product.completeLook
              .map((lookSlug) =>
                products.find((item) => item.slug === lookSlug),
              )
              .filter(
                (item): item is (typeof products)[number] =>
                  item != null && item.category !== product.category,
              )
              .slice(0, 3)
              .map((lookProduct) => (
                <ProductCard
                  key={lookProduct.id}
                  product={lookProduct}
                  variant="compact"
                />
              ))}
          </div>
        </section>
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-3xl font-bold text-primary">
            You may also like
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
          </div>
        </section>
      </main>
    </StoreShell>
  );
}
