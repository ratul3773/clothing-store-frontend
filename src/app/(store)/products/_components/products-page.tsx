"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { StoreShell } from "@/components/layout/site-header";
import { ProductCard } from "@/components/common/product-card";
import { products } from "@/lib/data/products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initial === "all" ? [] : [initial],
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [sale, setSale] = useState<boolean>(false);
  const subcategories = {
    shirts: ["Oxford", "Linen", "Casual"],
    pants: ["Chinos", "Tailored", "Casual"],
  };
  const subcategorySlugs: Record<string, string[]> = {
    Oxford: ["classic-oxford-shirt"],
    Linen: ["indigo-linen-shirt"],
    Chinos: ["straight-chino", "everyday-tapered-chino"],
    Tailored: ["pleated-wool-trouser"],
    Casual: ["selvedge-straight-jean"],
  };
  const colors = Array.from(
    new Set(products.flatMap((p) => p.colors.map((color) => color.name))),
  );
  const toggleValue = (
    values: string[],
    value: string,
    setter: (next: string[]) => void,
  ) =>
    setter(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  const updatePrice = (index: 0 | 1, value: string) => {
    const next = Math.min(5000, Math.max(500, Number(value) || 500));
    setPriceRange((current) => {
      const range = [...current] as [number, number];
      range[index] =
        index === 0 ? Math.min(next, range[1]) : Math.max(next, range[0]);
      return range;
    });
  };
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedColors([]);
    setPriceRange([500, 5000]);
    setSale(false);
    setCategory("all");
  };
  const list = useMemo(() => {
    let x = products.filter((p) =>
      selectedCategories.length
        ? selectedCategories.includes(p.category)
        : category === "all" || p.category === category,
    );
    if (selectedSubcategories.length)
      x = x.filter((p) =>
        selectedSubcategories.some((subcategory) =>
          subcategorySlugs[subcategory]?.includes(p.slug),
        ),
      );
    if (selectedColors.length)
      x = x.filter((p) =>
        p.colors.some((color) => selectedColors.includes(color.name)),
      );
    x = x.filter(
      (p) =>
        (p.offerPrice ?? p.price) >= priceRange[0] &&
        (p.offerPrice ?? p.price) <= priceRange[1],
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
  }, [
    category,
    selectedCategories,
    selectedSubcategories,
    selectedColors,
    priceRange,
    sale,
    sort,
  ]);
  return (
    <>
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
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Filters</p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
              <Accordion defaultValue={["categories", "price"]}>
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3">
                      {Object.entries(subcategories).map(([key, items]) => (
                        <div key={key} className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-sm font-medium capitalize">
                            <Checkbox
                              checked={selectedCategories.includes(key)}
                              onCheckedChange={() =>
                                toggleValue(
                                  selectedCategories,
                                  key,
                                  setSelectedCategories,
                                )
                              }
                            />
                            {key}
                          </label>
                          <div className="ml-6 flex flex-col gap-2">
                            {items.map((item) => (
                              <label
                                key={item}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <Checkbox
                                  checked={selectedSubcategories.includes(item)}
                                  onCheckedChange={() =>
                                    toggleValue(
                                      selectedSubcategories,
                                      item,
                                      setSelectedSubcategories,
                                    )
                                  }
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="colors">
                  <AccordionTrigger>Color</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      {colors.map((color) => (
                        <label
                          key={color}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() =>
                              toggleValue(
                                selectedColors,
                                color,
                                setSelectedColors,
                              )
                            }
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                  <AccordionTrigger>Price</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex min-w-0 flex-col gap-4 px-1">
                      <Slider
                        className="w-full"
                        value={priceRange}
                        onValueChange={(value) =>
                          Array.isArray(value) &&
                          setPriceRange([
                            Math.max(500, value[0]),
                            Math.min(5000, value[1]),
                          ])
                        }
                        min={500}
                        max={5000}
                        step={100}
                        aria-label="Price range"
                      />
                      <div className="grid min-w-0 grid-cols-2 gap-2">
                        <label className="min-w-0 text-xs text-muted-foreground">
                          Low price
                          <Input
                            className="mt-1 h-9 min-w-0"
                            type="number"
                            min={500}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(event) =>
                              updatePrice(0, event.target.value)
                            }
                            aria-label="Low price"
                          />
                        </label>
                        <label className="min-w-0 text-xs text-muted-foreground">
                          High price
                          <Input
                            className="mt-1 h-9 min-w-0"
                            type="number"
                            min={priceRange[0]}
                            max={5000}
                            value={priceRange[1]}
                            onChange={(event) =>
                              updatePrice(1, event.target.value)
                            }
                            aria-label="High price"
                          />
                        </label>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>৳{priceRange[0].toLocaleString()}</span>
                        <span>৳{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <Checkbox
                  checked={sale}
                  onCheckedChange={(value) => setSale(Boolean(value))}
                />
                On sale
              </label>
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
            <div className="mt-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Filter products</p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
              <Accordion defaultValue={["categories", "price"]}>
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3">
                      {Object.entries(subcategories).map(([key, items]) => (
                        <div key={key} className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-sm font-medium capitalize">
                            <Checkbox
                              checked={selectedCategories.includes(key)}
                              onCheckedChange={() =>
                                toggleValue(
                                  selectedCategories,
                                  key,
                                  setSelectedCategories,
                                )
                              }
                            />
                            {key}
                          </label>
                          <div className="ml-6 flex flex-col gap-2">
                            {items.map((item) => (
                              <label
                                key={item}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <Checkbox
                                  checked={selectedSubcategories.includes(item)}
                                  onCheckedChange={() =>
                                    toggleValue(
                                      selectedSubcategories,
                                      item,
                                      setSelectedSubcategories,
                                    )
                                  }
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="colors">
                  <AccordionTrigger>Color</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      {colors.map((color) => (
                        <label
                          key={color}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() =>
                              toggleValue(
                                selectedColors,
                                color,
                                setSelectedColors,
                              )
                            }
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                  <AccordionTrigger>Price</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex min-w-0 flex-col gap-4 px-1">
                      <Slider
                        className="w-full"
                        value={priceRange}
                        onValueChange={(value) =>
                          Array.isArray(value) &&
                          setPriceRange([
                            Math.max(500, value[0]),
                            Math.min(5000, value[1]),
                          ])
                        }
                        min={500}
                        max={5000}
                        step={100}
                        aria-label="Price range"
                      />
                      <div className="grid min-w-0 grid-cols-2 gap-2">
                        <label className="min-w-0 text-xs text-muted-foreground">
                          Low price
                          <Input
                            className="mt-1 h-9 min-w-0"
                            type="number"
                            min={500}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(event) =>
                              updatePrice(0, event.target.value)
                            }
                            aria-label="Low price"
                          />
                        </label>
                        <label className="min-w-0 text-xs text-muted-foreground">
                          High price
                          <Input
                            className="mt-1 h-9 min-w-0"
                            type="number"
                            min={priceRange[0]}
                            max={5000}
                            value={priceRange[1]}
                            onChange={(event) =>
                              updatePrice(1, event.target.value)
                            }
                            aria-label="High price"
                          />
                        </label>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>৳{priceRange[0].toLocaleString()}</span>
                        <span>৳{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={sale}
                  onCheckedChange={(value) => setSale(Boolean(value))}
                />
                On sale
              </label>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}