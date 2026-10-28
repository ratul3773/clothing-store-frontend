import type { PublicProduct } from "@/redux/apis/types/product.types";
import type { Color, Product } from "@/data/catalog";

const fitLabel = (fit: PublicProduct["fit"]) => {
  if (!fit) return "Regular fit";
  return `${fit.charAt(0).toUpperCase()}${fit.slice(1)} fit`;
};

/**
 * Keeps the existing storefront presentation stable while sourcing products
 * from the public API. Fields that are not part of the public product DTO are
 * represented by neutral values rather than demo catalogue data.
 */
export function toStorefrontProduct(product: PublicProduct): Product {
  const images = product.images
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.url);

  const imageIndex = new Map(
    product.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image, index) => [image.id, index]),
  );

  const colors: Color[] = product.colors.map((color) => {
    const image = product.images.find((candidate) => candidate.colorId === color.id);
    return {
      name: color.name,
      hex: color.hex ?? "#d6d3d1",
      // -1 means the colour has no image assigned. The gallery keeps the
      // current colour when an unassigned product image is selected.
      image: image ? imageIndex.get(image.id) ?? -1 : -1,
    };
  });

  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size)));
  const stock = Object.fromEntries(
    product.variants.map((variant) => [
      `${variant.colorName}|${variant.size}`,
      Math.max(0, variant.available),
    ]),
  );

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.slug,
    status: "active",
    custom: true,
    sub: product.category.name,
    price: product.regularPrice,
    offer:
      product.hasOffer && product.effectivePrice < product.regularPrice
        ? product.effectivePrice
        : undefined,
    badges: product.badges,
    material: product.material ?? "",
    fit: fitLabel(product.fit),
    care: product.careInstructions ?? "",
    desc: product.description ?? "",
    images,
    colors,
    sizes,
    stock,
    rating: 0,
    reviews: 0,
    sku: product.code ?? "",
    look: [],
    sold: 0,
  };
}

export function toStorefrontProducts(products: PublicProduct[]): Product[] {
  return products.map(toStorefrontProduct);
}
