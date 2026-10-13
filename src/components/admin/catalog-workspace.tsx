"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ImagePlus,
  MoreHorizontal,
  PackagePlus,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import {
  adminCategories,
  adminCollections,
  adminProducts,
  inventoryRows,
  type AdminProduct,
} from "@/lib/admin-catalog-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(3, "SKU is required"),
  description: z.string().min(10, "Add a short product description"),
  category: z.enum(["Shirts", "Pants"]),
  price: z.coerce.number().positive("Price must be greater than zero"),
  compareAt: z.coerce.number().positive().optional(),
  colors: z.string().min(2, "Add at least one colour"),
  sizes: z.string().min(1, "Add at least one size"),
  quantity: z.coerce.number().int().min(0),
});
type ProductForm = z.input<typeof productSchema>;

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={
        status === "Active" || status === "Live" || status === "Visible"
          ? "secondary"
          : "outline"
      }
    >
      {status}
    </Badge>
  );
}

export function ProductsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [stockProduct, setStockProduct] = React.useState<AdminProduct | null>(
    null,
  );
  const filtered = adminProducts.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()),
  );
  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((p) => p.id),
    );
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Catalog"
        title="Products"
        description="Manage your collection, pricing, variants, and storefront visibility."
        action={
          <Link className={buttonVariants()} href="/admin/catalog/products/new">
            <Plus data-icon="inline-start" />
            Add product
          </Link>
        }
      />
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search products or SKU"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger className="w-full md:w-44">
            <SlidersHorizontal data-icon="inline-start" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Shirts">Shirts</SelectItem>
            <SelectItem value="Pants">Pants</SelectItem>
          </SelectContent>
        </Select>
        {selected.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              toast.success(`${selected.length} products archived`);
              setSelected([]);
            }}
          >
            Archive selected
          </Button>
        )}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All products</CardTitle>
            <CardDescription>
              {filtered.length} products in your catalog
            </CardDescription>
          </div>
          <Badge variant="outline">BDT pricing</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        filtered.length > 0 &&
                        selected.length === filtered.length
                      }
                      onCheckedChange={toggleAll}
                      aria-label="Select all products"
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(product.id)}
                        onCheckedChange={(checked) =>
                          setSelected((current) =>
                            checked
                              ? [...current, product.id]
                              : current.filter((id) => id !== product.id),
                          )
                        }
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-56 items-center gap-3">
                        <div className="relative size-11 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/catalog/products/${product.id}`}
                            className="font-medium hover:underline"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {product.sku} · {product.variants}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      ৳{product.price.toLocaleString("en-BD")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          product.stock < 10 &&
                            "font-semibold text-destructive",
                        )}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                          aria-label={`Actions for ${product.name}`}
                        >
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`/admin/catalog/products/${product.id}`);
                            }}
                          >
                            <Edit3 data-icon="inline-start" />
                            Edit product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStockProduct(product)}
                          >
                            <PackagePlus data-icon="inline-start" />
                            Adjust stock
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/admin/marketing/flash-sales?addProduct=${encodeURIComponent(product.id)}`,
                              )
                            }
                          >
                            <Zap data-icon="inline-start" />
                            Add to flash sale
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success(`${product.name} duplicated`)
                            }
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              toast.success(`${product.name} moved to archive`)
                            }
                          >
                            <Trash2 data-icon="inline-start" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <PackagePlus className="text-muted-foreground" />
              <p className="font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
            <span>
              Showing {filtered.length} of {adminProducts.length}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {stockProduct && (
        <AdjustStockDialog
          row={
            inventoryRows.find((item) => item.id === stockProduct.id) ?? {
              ...stockProduct,
              committed: 0,
              available: stockProduct.stock,
            }
          }
          onClose={() => setStockProduct(null)}
          onAdjust={() => {
            setStockProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  edit = false,
}: {
  product?: AdminProduct;
  edit?: boolean;
}) {
  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      description:
        "A considered everyday essential, cut for a clean modern wardrobe.",
      category: product?.category ?? "Shirts",
      price: product?.price ?? 2490,
      compareAt: 2950,
      colors: "Indigo, Sand",
      sizes: "S, M, L, XL, XXL",
      quantity: product?.stock ?? 0,
    },
  });
  const onSubmit = (values: ProductForm) => {
    toast.success(edit ? "Product updated" : "Product created", {
      description: `${values.name} is ready in the catalog.`,
    });
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <div className="flex items-center justify-between">
        <PageHeading
          eyebrow={edit ? "Catalog / Edit" : "Catalog / New product"}
          title={edit ? "Edit product" : "Create product"}
          description="Build a polished product record with variants and BDT pricing."
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {edit ? "Save changes" : "Publish product"}
        </Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product details</CardTitle>
              <CardDescription>
                Core information shown on the storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!form.formState.errors.name}>
                  <FieldLabel htmlFor="name">Product name</FieldLabel>
                  <Input
                    id="name"
                    {...form.register("name")}
                    aria-invalid={!!form.formState.errors.name}
                  />
                  {form.formState.errors.name && (
                    <FieldDescription>
                      {form.formState.errors.name.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field data-invalid={!!form.formState.errors.sku}>
                  <FieldLabel htmlFor="sku">SKU</FieldLabel>
                  <Input
                    id="sku"
                    {...form.register("sku")}
                    aria-invalid={!!form.formState.errors.sku}
                  />
                  {form.formState.errors.sku && (
                    <FieldDescription>
                      {form.formState.errors.sku.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>
                Use comma-separated values for the initial mock catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldLegend>Available options</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="colors">Colours</FieldLabel>
                    <Input id="colors" {...form.register("colors")} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="sizes">Sizes</FieldLabel>
                    <Input id="sizes" {...form.register("sizes")} />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & stock</CardTitle>
              <CardDescription>
                All values are in Bangladeshi taka.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    defaultValue={product?.category ?? "Shirts"}
                    onValueChange={(value) =>
                      form.setValue(
                        "category",
                        value as ProductForm["category"],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shirts">Shirts</SelectItem>
                      <SelectItem value="Pants">Pants</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="price">Selling price</FieldLabel>
                  <Input id="price" type="number" {...form.register("price")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="compareAt">Compare-at price</FieldLabel>
                  <Input
                    id="compareAt"
                    type="number"
                    {...form.register("compareAt")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="quantity">Opening stock</FieldLabel>
                  <Input
                    id="quantity"
                    type="number"
                    {...form.register("quantity")}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Preview product imagery before publishing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product?.image ?? "/images/p-indigo-linen.png"}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Image uploader is mocked for Phase 2")
                  }
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-muted"
                >
                  <ImagePlus />
                  Add image
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export function ProductEditor({ productId }: { productId?: string }) {
  const product = adminProducts.find((p) => p.id === productId);
  if (productId && !product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product not found</CardTitle>
          <CardDescription>
            The requested product does not exist in the isolated mock catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.history.back()}>Go back</Button>
        </CardContent>
      </Card>
    );
  }
  return <ProductForm product={product} edit={Boolean(productId)} />;
}

type CategoryRow = {
  name: string;
  slug: string;
  products: number;
  visibility: string;
  updated: string;
  subcategories: string[];
};

export function CategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryRow[]>(() =>
    adminCategories.map((category) => ({
      ...category,
      subcategories:
        category.name === "Shirts"
          ? ["Linen", "Oxford", "Casual"]
          : ["Chinos", "Tailored"],
    })),
  );
  const [editing, setEditing] = React.useState<
    (typeof categories)[number] | null
  >(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [subcategories, setSubcategories] = React.useState("");

  function openCategory(category?: (typeof categories)[number]) {
    setEditing(category ?? null);
    setName(category?.name ?? "");
    setSubcategories(category?.subcategories.join(", ") ?? "");
    setDialogOpen(true);
  }

  function saveCategory() {
    const next = {
      name: name.trim() || "Untitled category",
      slug: (name.trim() || "untitled-category")
        .toLowerCase()
        .replace(/\\s+/g, "-"),
      products: editing?.products ?? 0,
      visibility: editing?.visibility ?? "Visible",
      updated: "Just now",
      subcategories: subcategories
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    setCategories((current) =>
      editing
        ? current.map((item) => (item.slug === editing.slug ? next : item))
        : [...current, next],
    );
    setDialogOpen(false);
    toast.success(editing ? "Category updated" : "Category created");
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Catalog"
        title="Categories & subcategories"
        description="Create and manage the taxonomy that powers storefront navigation."
        action={
          <Button onClick={() => openCategory()}>
            <Plus data-icon="inline-start" />
            New category
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Storefront taxonomy</CardTitle>
          <CardDescription>
            Manage categories, subcategories, visibility, and merchandising
            ownership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.slug}>
                    <TableCell>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        /{category.slug}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {category.subcategories.map((item) => (
                          <Badge key={item} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{category.products}</TableCell>
                    <TableCell>
                      <StatusBadge status={category.visibility} />
                    </TableCell>
                    <TableCell>{category.updated}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                          aria-label={`Actions for ${category.name}`}
                        >
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openCategory(category)}
                          >
                            <Edit3 data-icon="inline-start" />
                            Edit category
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setCategories((current) =>
                                current.filter(
                                  (item) => item.slug !== category.slug,
                                ),
                              );
                              toast.success("Category deleted");
                            }}
                          >
                            <Trash2 data-icon="inline-start" />
                            Delete category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "New category"}
            </DialogTitle>
            <DialogDescription>
              Add a category and its subcategories for the storefront.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category-name">Category name</FieldLabel>
              <Input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Shirts"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="category-subcategories">
                Subcategories
              </FieldLabel>
              <Input
                id="category-subcategories"
                value={subcategories}
                onChange={(event) => setSubcategories(event.target.value)}
                placeholder="Linen, Oxford, Casual"
              />
              <FieldDescription>
                Separate subcategories with commas.
              </FieldDescription>
            </Field>
            <Button onClick={saveCategory}>
              {editing ? "Save changes" : "Create category"}
            </Button>
          </FieldGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CollectionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Catalog"
        title="Collections"
        description="Curate seasonal edits and merchandising stories."
        action={
          <Button onClick={() => toast.success("Collection creation opened")}>
            <Plus data-icon="inline-start" />
            New collection
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-3">
        {adminCollections.map((collection) => (
          <Card key={collection.name}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{collection.name}</CardTitle>
                <StatusBadge status={collection.status} />
              </div>
              <CardDescription>{collection.type} collection</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{collection.products}</p>
              <p className="text-sm text-muted-foreground">products included</p>
              <Button
                variant="outline"
                className="mt-5 w-full"
                onClick={() => toast.success(`${collection.name} opened`)}
              >
                Manage collection
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function InventoryPage() {
  const [query, setQuery] = React.useState("");
  const filtered = inventoryRows.filter((row) =>
    `${row.name} ${row.sku}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Operations"
        title="Inventory"
        description="Monitor stock levels and make quick adjustments across variants."
      />
      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search inventory"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stock levels</CardTitle>
          <CardDescription>
            Low stock is highlighted for immediate action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>On hand</TableHead>
                  <TableHead>Committed</TableHead>
                  <TableHead>Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 overflow-hidden rounded bg-muted">
                          <Image
                            src={row.image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{row.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.sku}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        row.stock < 10 && "font-semibold text-destructive",
                      )}
                    >
                      {row.stock}
                    </TableCell>
                    <TableCell>{row.committed}</TableCell>
                    <TableCell>{row.available}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdjustStockDialog({
  row,
  onAdjust,
  onClose,
}: {
  row: (typeof inventoryRows)[number];
  onAdjust: (amount: number) => void;
  onClose?: () => void;
}) {
  const [amount, setAmount] = React.useState("1");
  return (
    <Dialog
      open={onClose ? true : undefined}
      onOpenChange={(open) => !open && onClose?.()}
    >
      {!onClose && (
        <DialogTrigger className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted">
          <PackagePlus data-icon="inline-start" />
          Adjust
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust {row.name}</DialogTitle>
          <DialogDescription>
            Record a stock adjustment for {row.sku}.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`adjust-${row.id}`}>
              Units to add or remove
            </FieldLabel>
            <Input
              id={`adjust-${row.id}`}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Button
            onClick={() => {
              onAdjust(Number(amount) || 0);
              toast.success("Inventory updated");
              onClose?.();
            }}
          >
            Save adjustment
          </Button>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
