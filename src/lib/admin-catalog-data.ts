import { products } from "@/lib/data/products";

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  category: "Shirts" | "Pants";
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Archived";
  image: string;
  variants: string;
};

export const adminProducts: AdminProduct[] = products.map((product, index) => ({
  id: product.id,
  name: product.name,
  sku: `NEEL-${product.category === "shirts" ? "SHT" : "PNT"}-${String(index + 101)}`,
  category: product.category === "shirts" ? "Shirts" : "Pants",
  price: product.offerPrice ?? product.price,
  stock: [24, 8, 42, 5, 31, 12][index % 6],
  status: index === 4 ? "Draft" : "Active",
  image: product.images[0],
  variants: `${product.colors.length} colours · ${product.sizes.length} sizes`,
}));

export const adminCategories = [
  {
    name: "Shirts",
    slug: "shirts",
    products: 8,
    visibility: "Visible",
    updated: "Today",
  },
  {
    name: "Pants",
    slug: "pants",
    products: 6,
    visibility: "Visible",
    updated: "Yesterday",
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    products: 3,
    visibility: "Visible",
    updated: "12 Jun 2026",
  },
  {
    name: "Accessories",
    slug: "accessories",
    products: 5,
    visibility: "Hidden",
    updated: "06 Jun 2026",
  },
] as const;

export const adminCollections = [
  { name: "New arrivals", products: 7, type: "Automated", status: "Live" },
  { name: "Monsoon edit", products: 12, type: "Manual", status: "Live" },
  { name: "Office hours", products: 9, type: "Automated", status: "Draft" },
] as const;

export const inventoryRows = adminProducts.map((product) => ({
  ...product,
  committed: Math.min(
    product.stock,
    Math.max(1, Math.round(product.stock * 0.24)),
  ),
  available: Math.max(
    0,
    product.stock - Math.max(1, Math.round(product.stock * 0.24)),
  ),
}));
