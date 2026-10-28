/**
 * Types mirroring the backend product module (`product.mapper.ts`,
 * `product.validation.ts`). All prices and stock values are integer taka /
 * units — the API does not convert currencies.
 */

export type Badge = "NEW" | "SALE" | "BEST_SELLER" | "LIMITED" | "COMBO";
export type Fit = "slim" | "regular" | "relaxed" | "oversized";
export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type OfferState = "ACTIVE" | "SCHEDULED" | "EXPIRED" | "INACTIVE";
export type StockAdjustmentType =
  | "RESTOCK"
  | "ADJUSTMENT"
  | "DAMAGED"
  | "STOCKTAKE";

export type ProductSort =
  | "newest"
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc";
export type AdminProductSort = ProductSort | "updated_desc";

export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type PublicProductQuery = PaginationQuery & {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  badge?: Badge;
  inStock?: "true" | "false";
  sort?: ProductSort;
};

export type AdminProductQuery = PaginationQuery & {
  q?: string;
  categoryId?: string;
  category?: string;
  status?: ProductStatus;
  badge?: Badge;
  inStock?: "true" | "false";
  minPrice?: number;
  maxPrice?: number;
  sort?: AdminProductSort;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  colorId: string | null;
  sortOrder: number;
  isPrimary: boolean;
  storageKey?: string;
  provider?: "LOCAL" | "BUNNY";
  createdAt: string;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string | null;
  sortOrder: number;
};

export type PublicVariant = {
  id: string;
  colorId: string;
  colorName: string;
  colorHex: string | null;
  size: string;
  sizeOrder: number;
  available: number;
  inStock: boolean;
  lowStock: boolean;
};

export type AdminVariant = PublicVariant & {
  sku: string;
  onHand: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductOffer = {
  id: string;
  offerPrice: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  state: OfferState;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductAuthor = {
  id: string;
  name: string;
  email: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  material: string | null;
  fit: Fit | null;
  careInstructions: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  regularPrice: number;
  effectivePrice: number;
  hasOffer: boolean;
  discountPercentage: number;
  offer: {
    offerPrice: number;
    startsAt: string;
    endsAt: string | null;
  } | null;
  badges: Badge[];
  isExchangeEligible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  images: ProductImage[];
  colors: ProductColor[];
  variants: PublicVariant[];
  inStock: boolean;
  lowStock: boolean;
};

export type AdminProduct = Omit<PublicProduct, "variants"> & {
  status: ProductStatus;
  version: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  variants: AdminVariant[];
  offers: ProductOffer[];
  images: ProductImage[];
  totalOnHand: number;
  totalReserved: number;
  createdBy: ProductAuthor | null;
  updatedBy: ProductAuthor | null;
};

/* ---------------------------------------------------------------- payloads */

export type ProductCore = {
  name: string;
  code: string;
  description?: string | null;
  material?: string | null;
  fit?: Fit | null;
  careInstructions?: string | null;
  categoryId: string;
  regularPrice: number;
  badges?: Badge[];
  isExchangeEligible?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type CreateColorPayload = {
  name: string;
  hex?: string | null;
  sortOrder?: number;
};

export type UpdateColorPayload = {
  name?: string;
  hex?: string | null;
  sortOrder?: number;
};

/** Variants embedded in a create-product request reference colours by name. */
export type CreateProductVariantPayload = {
  colorName: string;
  size: string;
  sizeOrder?: number;
  onHand?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
};

export type CreateProductPayload = ProductCore & {
  colors?: CreateColorPayload[];
  variants?: CreateProductVariantPayload[];
};

export type UpdateProductPayload = Partial<ProductCore> & {
  version: number;
};

export type CreateVariantPayload = {
  colorId: string;
  size: string;
  sizeOrder?: number;
  onHand?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
};

export type UpdateVariantPayload = {
  size?: string;
  sizeOrder?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
  version: number;
};

export type StockAdjustmentPayload = {
  type: StockAdjustmentType;
  quantity?: number;
  onHand?: number;
  note?: string | null;
};

export type StockMovement = {
  id: string;
  type: string;
  onHandDelta: number;
  reservedDelta: number;
  onHandAfter: number;
  reservedAfter: number;
  refType: string | null;
  refId: string | null;
  note: string | null;
  actorType: string;
  actorId: string | null;
  createdAt: string;
};

export type StockAdjustmentResult = {
  product: AdminProduct;
  movement: {
    id: string;
    type: string;
    onHandDelta: number;
    onHandAfter: number;
    note: string | null;
    createdAt: string;
  };
};

export type CreateOfferPayload = {
  offerPrice: number;
  startsAt?: string;
  endsAt?: string | null;
  isActive?: boolean;
};

export type UpdateOfferPayload = Partial<CreateOfferPayload>;

export type UpdateImagePayload = {
  alt?: string | null;
  colorId?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
};
