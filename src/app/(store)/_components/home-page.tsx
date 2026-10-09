import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { StoreShell, TrustStrip } from "@/components/layout/site-header";
import { ProductCard } from "@/components/common/product-card";
import { SectionHeading } from "@/components/common/section-header";
import { categories, products } from "@/lib/data/products";
import { FlashSaleSection } from "./flash-sale-section";
import { PromoCarousel } from "./promo-carousel";

export default function Page() {
  const featured = products.slice(0, 4);
  return (
    <StoreShell>
      <main>
        <PromoCarousel />
        <TrustStrip />
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Start here"
            title="The everyday edit"
            href="/shop"
            linkLabel="View all"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative min-h-[300px] overflow-hidden bg-surface"
              >
                <Image
                  src={category.image}
                  fill
                  alt={category.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-background">
                  <h3 className="font-display text-4xl font-bold tracking-[-0.04em]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-background/80">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <FlashSaleSection />
        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Customer favourites"
              title="The pieces you reach for"
              href="/shop"
              linkLabel="Shop all"
            />
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
              From the studio
            </p>
            <h2 className="mt-4 font-display text-5xl font-black leading-[0.9] tracking-[-0.06em] text-primary">
              Fit for the
              <br />
              real world.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              We obsess over the quiet details: fabric weight, pocket placement,
              a collar that sits right after a hundred washes. Nothing loud.
              Everything useful.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-primary"
            >
              Read our story <MoveRight className="size-4" />
            </Link>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-surface">
            <Image
              src="/images/lookbook.png"
              fill
              alt="Neel lookbook portrait"
              className="object-cover"
            />
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="bg-primary px-6 py-10 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:px-10">
            <div>
              <p className="font-display text-3xl font-bold tracking-[-0.04em]">
                Built for Bangladesh.
              </p>
              <p className="mt-2 text-sm text-primary-foreground/70">
                From ৳1,850 · Free delivery on orders over ৳3,000
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-8 sm:mt-0"
            >
              See everything <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    </StoreShell>
  );
}
