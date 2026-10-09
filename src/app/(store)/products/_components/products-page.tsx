"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { StoreShell } from "@/components/layout/site-header";
import { ProductCard } from "@/components/common/product-card";
import { products } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShopPage() {
  const params = useSearchParams();
  const initial = params.get("category") || "all";
  const [category, setCategory] = useState(initial);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("featured");
  const [sale, setSale] = useState(false);
  const list = useMemo(() => {
    let x = products.filter(
      (p) => category === "all" || p.category === category,
    );
    if (sale) x = x.filter((p) => p.offerPrice);
    if (sort === "low")
      x = [...x].sort(
        (a, b) => (a.offerPrice ?? a.price) - (b.offerPrice ?? b.price),
      );
    if (sort === "high")
      x = [...x].sort(
        (a, b) => (b.offerPrice ?? b.price) - (a.offerPrice ?? a.price),
      );
    return x;
  }, [category, sale, sort]);
  return (
    <StoreShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
            The collection
          </p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.06em] text-primary sm:text-7xl">
            Shop all.
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Easy layers, reliable trousers and the pieces that make getting
            dressed simpler.
          </p>
        </div>
        <div className="flex items-center justify-between border-b border-border py-4">
          <div className="flex gap-1">
            <Button
              variant={category === "all" ? "secondary" : "ghost"}
              onClick={() => setCategory("all")}
            >
              All
            </Button>
            <Button
              variant={category === "shirts" ? "secondary" : "ghost"}
              onClick={() => setCategory("shirts")}
            >
              Shirts
            </Button>
            <Button
              variant={category === "pants" ? "secondary" : "ghost"}
              onClick={() => setCategory("pants")}
            >
              Pants
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="size-4" /> Filter
            </Button>
            <Select
              value={sort}
              onValueChange={(value) => value && setSort(value)}
            >
              <SelectTrigger className="w-[155px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="low">Price: low to high</SelectItem>
                <SelectItem value="high">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-8 py-8 lg:grid-cols-[210px_1fr]">
          <aside className="hidden border-r border-border pr-6 lg:block">
            <p className="text-sm font-bold">Filter by</p>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-semibold">Category</p>
              <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  className="justify-start px-0"
                  onClick={() => setCategory("all")}
                >
                  All products
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start px-0"
                  onClick={() => setCategory("shirts")}
                >
                  Shirts
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start px-0"
                  onClick={() => setCategory("pants")}
                >
                  Pants
                </Button>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={sale}
                  onCheckedChange={(v) => setSale(!!v)}
                  id="sale"
                />
                <Label htmlFor="sale">On sale</Label>
              </div>
            </div>
          </aside>
          <div>
            <p className="mb-5 text-sm text-muted-foreground">
              {list.length} products
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/30 lg:hidden"
          onClick={() => setFilterOpen(false)}
        >
          <aside
            className="ml-auto h-full w-[min(88vw,360px)] bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilterOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={sale}
                  onCheckedChange={(v) => setSale(!!v)}
                  id="mobile-sale"
                />
                <Label htmlFor="mobile-sale">On sale</Label>
              </div>
            </div>
          </aside>
        </div>
      )}
    </StoreShell>
  );
}
