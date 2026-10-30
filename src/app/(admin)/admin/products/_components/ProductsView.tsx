"use client";

import { useSearchParams } from "@/lib/nav";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

export default function ProductsView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  if (searchParams.get("new") === "1") return <ProductForm key="new" />;
  if (id) return <ProductForm key={id} productId={id} />;
  return <ProductList />;
}
