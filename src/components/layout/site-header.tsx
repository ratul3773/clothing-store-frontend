"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartSheet } from "@/components/layout/cart-sheet";
import { useAppSelector } from "@/lib/redux/store";

const categoryMenus = [
  {
    label: "Shirts",
    slug: "shirts",
    items: [
      { label: "All shirts", slug: "shirts" },
      { label: "Jeans shirt", slug: "jeans-shirt" },
      { label: "Formal shirt", slug: "formal-shirt" },
      { label: "Casual shirt", slug: "casual-shirt" },
      { label: "Linen shirt", slug: "linen-shirt" },
    ],
  },
  {
    label: "Pants",
    slug: "pants",
    items: [
      { label: "All pants", slug: "pants" },
      { label: "Denim pants", slug: "denim-pants" },
      { label: "Baggy pants", slug: "baggy-pants" },
      { label: "Cargo pants", slug: "cargo-pants" },
      { label: "Formal pants", slug: "formal-pants" },
    ],
  },
  {
    label: "Combo",
    slug: "combo",
    items: [
      { label: "All combos", slug: "combo" },
      { label: "Shirt & pants", slug: "shirt-pants" },
      { label: "Office combos", slug: "office-combo" },
      { label: "Weekend combos", slug: "weekend-combo" },
    ],
  },
] as const;

function categoryHref(category: string, subcategory: string) {
  return `/shop?category=${category}&subcategory=${subcategory}`;
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const count = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const wishlistCount = useAppSelector(
    (state) => state.preferences.wishlist.length,
  );

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-xs font-medium tracking-[0.12em] text-primary-foreground">
        ঢাকার ভেতরে ৭০৳ ডেলিভারি · ৩,০০০৳ এর বেশি অর্ডারে ফ্রি
      </div>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:h-[76px] lg:px-8">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu data-icon="inline-start" />
          </Button>
          <Link
            href="/"
            className="font-display text-3xl font-black tracking-[-0.06em] text-primary"
          >
            NEEL<span className="text-accent">.</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <Link href="/shop" className="transition-colors hover:text-primary">
              Shop
            </Link>
            {categoryMenus.map((category) => (
              <div key={category.slug} className="group relative">
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="inline-flex items-center gap-1 py-5 transition-colors hover:text-primary"
                >
                  {category.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 translate-y-2 rounded-md border border-border bg-background p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {category.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={categoryHref(category.slug, item.slug)}
                      className="block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/about"
              className="transition-colors hover:text-primary"
            >
              Our story
            </Link>
          </nav>
          <div className="flex items-center gap-1">
            <form
              action="/shop"
              className="hidden items-center gap-1 rounded-md border border-border bg-background px-1 py-1 sm:flex"
            >
              <label htmlFor="nav-search" className="sr-only">
                Search products
              </label>
              <Input
                id="nav-search"
                name="q"
                placeholder="Search products"
                className="h-8 w-32 border-0 bg-transparent px-2 text-sm shadow-none outline-none focus-visible:ring-0 lg:w-40"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="Submit product search"
                className="size-8"
              >
                <Search className="size-4" />
              </Button>
            </form>
            <Link href="/account" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" aria-label="Account">
                <UserRound className="size-[18px]" />
              </Button>
            </Link>
            <Link href="/account?tab=wishlist">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Wishlist, ${wishlistCount} items`}
                className="relative"
              >
                <Heart className="size-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Cart, ${count} items`}
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
        <form
          action="/shop"
          className="flex items-center gap-2 border-t border-border/60 px-4 py-3 sm:hidden"
        >
          <label htmlFor="mobile-nav-search" className="sr-only">
            Search products
          </label>
          <Input
            id="mobile-nav-search"
            name="q"
            placeholder="Search shirts, chinos, linen..."
          />
          <Button type="submit" aria-label="Submit product search">
            <Search className="size-4" />
            <span>Search</span>
          </Button>
        </form>
      </header>
      {mobileMenuOpen && (
        <div
          className="fade-overlay fixed inset-0 z-50 bg-foreground/30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-[min(82vw,360px)] bg-background p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-black text-primary">
                NEEL<span className="text-accent">.</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </Button>
            </div>
            <nav className="mt-10 grid gap-6 text-lg">
              <Link href="/shop">Shop all</Link>
              {categoryMenus.map((category) => (
                <details key={category.slug} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span>{category.label}</span>
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 grid gap-3 border-l border-border pl-4 text-base text-muted-foreground">
                    {category.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={categoryHref(category.slug, item.slug)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
              <Link href="/about">Our story</Link>
              <Link href="/account">Account</Link>
            </nav>
          </aside>
        </div>
      )}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="font-display text-3xl font-black text-primary"
          >
            NEEL<span className="text-accent">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Everyday menswear, cut in Bangladesh and made for the way you move
            through it.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
            Shop
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <Link href="/shop">All products</Link>
            <Link href="/shop?category=shirts">Shirts</Link>
            <Link href="/shop?category=pants">Pants</Link>
            <Link href="/shop?category=combo">Combo</Link>
            <Link href="/account?tab=wishlist">Wishlist</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
            Help
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <Link href="/delivery">Delivery</Link>
            <Link href="/returns">Returns & exchanges</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/account">Track an order</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
            Stay in the loop
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            New drops, quiet offers. No noise.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <form className="mt-4 flex gap-2">
            <Input
              type="email"
              placeholder="Your email"
              aria-label="Email address"
            />
            <Button size="icon" aria-label="Subscribe">
              →
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © 2026 Neel Clothing · Made in Bangladesh · বিকাশ · নগদ · Cash on
        delivery
      </div>
    </footer>
  );
}

export function TrustStrip() {
  return (
    <div className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
      <div className="bg-background px-5 py-6 text-center">
        <strong className="block text-sm">Free delivery over ৳3,000</strong>
        <span className="mt-1 block text-xs text-muted-foreground">
          Nationwide, tracked
        </span>
      </div>
      <div className="bg-background px-5 py-6 text-center">
        <strong className="block text-sm">7-day easy exchange</strong>
        <span className="mt-1 block text-xs text-muted-foreground">
          Unused items, no fuss
        </span>
      </div>
      <div className="bg-background px-5 py-6 text-center">
        <strong className="block text-sm">Secure local payments</strong>
        <span className="mt-1 block text-xs text-muted-foreground">
          bKash, Nagad & COD
        </span>
      </div>
    </div>
  );
}

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

export function CartButton() {
  return null;
}

export function ClientOnly() {
  return null;
}
