"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const banners = [
  {
    eyebrow: "Flash sale · Up to 30% off",
    title: `The good stuff,
less.`,
    description:
      "Limited-time prices on everyday layers, linen shirts, and easy trousers.",
    image: "/images/hero.png",
    href: "/shop?badge=sale",
    tone: "bg-[#dfe4e8]",
  },
  {
    eyebrow: "New in · Summer '26",
    title: `Made for
moving.`,
    description:
      "Lightweight pieces cut for hot days and long walks through the city.",
    image: "/images/lookbook.png",
    href: "/shop?sort=newest",
    tone: "bg-[#d8c7a6]",
  },
  {
    eyebrow: "Complete the look",
    title: `Two pieces.
One easy answer.`,
    description:
      "Build a considered outfit with our new shirt and trouser pairings.",
    image: "/images/cat-pants.png",
    href: "/shop?category=combo",
    tone: "bg-[#d9d6cf]",
  },
] as const;

export function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBanner = banners[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(showNext, 7500);

    return () => window.clearInterval(timer);
  }, [activeIndex]);

  function showPrevious() {
    setActiveIndex(
      (current) => (current - 1 + banners.length) % banners.length,
    );
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % banners.length);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div
        className={`relative min-h-[360px] overflow-hidden ${activeBanner.tone}`}
      >
        <Image
          key={activeBanner.image}
          src={activeBanner.image}
          fill
          priority={activeIndex === 0}
          alt=""
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/35 to-transparent" />
        <div
          key={activeIndex}
          className="banner-content-enter relative z-10 flex min-h-[360px] max-w-xl flex-col justify-center px-6 py-12 text-background sm:px-12 lg:px-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-background/80">
            {activeBanner.eyebrow}
          </p>
          <h2 className="mt-4 whitespace-pre-line font-display text-5xl font-black leading-[0.88] tracking-[-0.07em] sm:text-7xl">
            {activeBanner.title}
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-background/80">
            {activeBanner.description}
          </p>
          <Link
            href={activeBanner.href}
            className="mt-8 inline-flex w-fit items-center gap-3 text-sm font-bold underline underline-offset-8"
          >
            Shop the edit <ArrowRight className="size-4" />
          </Link>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={showPrevious}
          aria-label="Previous banner"
          className="absolute left-4 top-1/2 z-10 size-11 -translate-y-1/2 rounded-full border border-background/50 bg-foreground/20 text-background backdrop-blur hover:bg-foreground/40 sm:left-6"
        >
          <ChevronLeft data-icon="inline-start" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={showNext}
          aria-label="Next banner"
          className="absolute right-4 top-1/2 z-10 size-11 -translate-y-1/2 rounded-full border border-background/50 bg-foreground/20 text-background backdrop-blur hover:bg-foreground/40 sm:right-6"
        >
          <ChevronRight data-icon="inline-start" />
        </Button>
      </div>
      <div
        className="mt-4 flex justify-center gap-2"
        aria-label="Banner slides"
      >
        {banners.map((banner, index) => (
          <Button
            key={banner.eyebrow}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Show banner ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full p-0 transition-all ${index === activeIndex ? "w-10 bg-primary" : "w-5 bg-border"}`}
          />
        ))}
      </div>
    </section>
  );
}

export { banners };
