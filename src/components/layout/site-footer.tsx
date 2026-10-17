import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
            <Link href="/products">All products</Link>
            <Link href="/products?category=shirts">Shirts</Link>
            <Link href="/products?category=pants">Pants</Link>
            <Link href="/products?category=combo">Combo</Link>
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