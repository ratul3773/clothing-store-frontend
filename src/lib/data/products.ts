import type { Category, Product } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "shirts",
    name: "Shirts",
    nameBn: "শার্ট",
    description: "Oxford, linen and poplin — cut for Dhaka weather.",
    image: "/images/cat-shirts.png",
  },
  {
    slug: "pants",
    name: "Pants",
    nameBn: "প্যান্ট",
    description: "Chinos, trousers and denim with a clean taper.",
    image: "/images/cat-pants.png",
  },
];

const SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
const PANT_SIZES = ["30", "32", "34", "36", "38"];

const shirtSpecs = (fabric: string, gsm: string) => [
  { label: "Fabric", value: fabric },
  { label: "Weight", value: gsm },
  { label: "Collar", value: "Button-down" },
  { label: "Care", value: "Machine wash cold, line dry" },
  { label: "Made in", value: "Bangladesh" },
];

const pantSpecs = (fabric: string, rise: string) => [
  { label: "Fabric", value: fabric },
  { label: "Rise", value: rise },
  { label: "Closure", value: "Zip fly, horn-effect button" },
  { label: "Care", value: "Machine wash cold, inside out" },
  { label: "Made in", value: "Bangladesh" },
];

export const products: Product[] = [
  {
    id: "p01",
    slug: "classic-oxford-shirt",
    name: "Classic Oxford Shirt",
    category: "shirts",
    fit: "Regular fit",
    fabric: "100% cotton oxford",
    price: 2450,
    images: ["/images/p-oxford-white.png"],
    colors: [
      { name: "White", swatch: "#F4F4F2" },
      { name: "Sky", swatch: "#B9CCE4" },
    ],
    sizes: SHIRT_SIZES,
    unavailableSizes: [],
    availability: "in_stock",
    badges: ["best_seller"],
    rating: 4.7,
    reviewCount: 128,
    shortDescription:
      "A wardrobe anchor in soft-washed oxford cloth. Button-down collar, single chest pocket and a curved hem that works tucked or untucked.",
    details: [
      "Soft-washed 140 GSM oxford for everyday comfort",
      "Button-down collar keeps its shape under a blazer",
      "Back box pleat with locker loop",
      "Curved hem, sits mid-seat when untucked",
    ],
    specs: shirtSpecs("100% cotton oxford", "140 GSM"),
    completeLook: ["everyday-tapered-chino", "selvedge-straight-jean"],
    createdAt: "2026-06-02",
  },
  {
    id: "p02",
    slug: "indigo-linen-shirt",
    name: "Indigo Linen Shirt",
    category: "shirts",
    fit: "Relaxed fit",
    fabric: "100% European linen",
    price: 2950,
    offerPrice: 2490,
    images: ["/images/p-indigo-linen.png", "/images/p-indigo-linen-model.png"],
    colors: [
      { name: "Indigo", swatch: "#2E3F73" },
      { name: "Sand", swatch: "#D8C7A6" },
    ],
    sizes: SHIRT_SIZES,
    unavailableSizes: ["S"],
    availability: "in_stock",
    badges: ["sale", "new"],
    rating: 4.8,
    reviewCount: 86,
    shortDescription:
      "Garment-dyed in deep indigo for a lived-in tone that softens with every wash. Breathable linen made for humid afternoons.",
    details: [
      "Garment-dyed linen with natural slub texture",
      "Mother-of-pearl effect buttons",
      "Relaxed through chest and sleeve",
      "Colour may transfer slightly in first washes",
    ],
    specs: shirtSpecs("100% European linen", "165 GSM"),
    completeLook: ["straight-chino", "everyday-tapered-chino"],
    createdAt: "2026-09-18",
  },
  {
    id: "p03",
    slug: "camp-collar-linen-shirt",
    name: "Camp Collar Linen Shirt",
    category: "shirts",
    fit: "Boxy fit",
    fabric: "Linen-cotton blend",
    price: 2650,
    images: ["/images/p-sand-linen.png"],
    colors: [
      { name: "Sand", swatch: "#D8C7A6" },
      { name: "White", swatch: "#F4F4F2" },
    ],
    sizes: SHIRT_SIZES,
    unavailableSizes: [],
    availability: "in_stock",
    badges: ["new"],
    rating: 4.6,
    reviewCount: 41,
    shortDescription:
      "Short sleeves, open camp collar and a straight hem made to be worn out. Your Friday shirt.",
    details: [
      "55% linen, 45% cotton for less creasing",
      "Open camp collar",
      "Straight hem with side vents",
      "Boxy cut — size down for a closer fit",
    ],
    specs: shirtSpecs("55% linen, 45% cotton", "150 GSM"),
    completeLook: ["straight-chino", "utility-cargo-pant"],
    createdAt: "2026-09-25",
  },
  {
    id: "p04",
    slug: "striped-poplin-shirt",
    name: "Striped Poplin Shirt",
    category: "shirts",
    fit: "Regular fit",
    fabric: "Cotton poplin",
    price: 2350,
    offerPrice: 1990,
    images: ["/images/p-stripe-blue.png"],
    colors: [{ name: "Blue stripe", swatch: "#9DB6D9" }],
    sizes: SHIRT_SIZES,
    unavailableSizes: ["XXL"],
    availability: "low_stock",
    stockLeft: 4,
    badges: ["sale"],
    rating: 4.5,
    reviewCount: 63,
    shortDescription:
      "Crisp fine-stripe poplin for the office. Smooth hand-feel, sharp collar and a clean front placket.",
    details: [
      "Two-ply cotton poplin",
      "Spread collar with removable stays",
      "Adjustable two-button cuffs",
      "Easy-iron finish",
    ],
    specs: shirtSpecs("100% two-ply cotton poplin", "120 GSM"),
    completeLook: ["pleated-wool-blend-trouser", "everyday-tapered-chino"],
    createdAt: "2026-05-10",
  },
  {
    id: "p05",
    slug: "brushed-check-shirt",
    name: "Brushed Check Shirt",
    category: "shirts",
    fit: "Regular fit",
    fabric: "Brushed cotton flannel",
    price: 2750,
    images: ["/images/p-olive-check.png"],
    colors: [{ name: "Olive check", swatch: "#6E7350" }],
    sizes: SHIRT_SIZES,
    unavailableSizes: [],
    availability: "in_stock",
    badges: ["new"],
    rating: 4.6,
    reviewCount: 22,
    shortDescription:
      "Peach-brushed cotton in an olive-and-cream check. Warm enough for winter evenings, light enough to layer.",
    details: [
      "Double-brushed cotton for a soft face",
      "Twin chest pockets with button flaps",
      "Pattern matched at the placket",
      "Wear as a shirt or light overshirt",
    ],
    specs: shirtSpecs("100% brushed cotton", "180 GSM"),
    completeLook: ["selvedge-straight-jean", "utility-cargo-pant"],
    createdAt: "2026-09-30",
  },
  {
    id: "p06",
    slug: "slim-poplin-dress-shirt",
    name: "Slim Poplin Dress Shirt",
    category: "shirts",
    fit: "Slim fit",
    fabric: "Stretch cotton poplin",
    price: 2250,
    images: ["/images/p-black-poplin.png"],
    colors: [
      { name: "Black", swatch: "#1D1F24" },
      { name: "White", swatch: "#F4F4F2" },
    ],
    sizes: SHIRT_SIZES,
    unavailableSizes: [],
    availability: "in_stock",
    badges: ["best_seller"],
    rating: 4.4,
    reviewCount: 154,
    shortDescription:
      "A sharp slim-cut poplin with a touch of stretch. Built for weddings, dinners and long days that end late.",
    details: [
      "2% elastane for movement",
      "Concealed button-down collar",
      "Darted back for a tailored line",
      "Wrinkle-resistant finish",
    ],
    specs: shirtSpecs("98% cotton, 2% elastane", "125 GSM"),
    completeLook: ["pleated-wool-blend-trouser", "everyday-tapered-chino"],
    createdAt: "2026-03-14",
  },
  {
    id: "p07",
    slug: "everyday-tapered-chino",
    name: "Everyday Tapered Chino",
    category: "pants",
    fit: "Tapered fit",
    fabric: "Stretch cotton twill",
    price: 2850,
    images: ["/images/p-navy-chino.png"],
    colors: [
      { name: "Navy", swatch: "#232B45" },
      { name: "Stone", swatch: "#B9AE97" },
    ],
    sizes: PANT_SIZES,
    unavailableSizes: [],
    availability: "in_stock",
    badges: ["best_seller"],
    rating: 4.8,
    reviewCount: 211,
    shortDescription:
      "Our most-reordered pant. Comfortable stretch twill, a mid rise and a taper that sits cleanly over sneakers or loafers.",
    details: [
      "Stretch twill recovers shape through the day",
      "Mid rise, tapered from knee",
      "Slant front pockets, two back welt pockets",
      "Hemmed at 32 in inseam — free alteration in-store",
    ],
    specs: pantSpecs("97% cotton, 3% elastane", "Mid rise"),
    completeLook: ["classic-oxford-shirt", "indigo-linen-shirt"],
    createdAt: "2026-02-20",
  },
  {
    id: "p08",
    slug: "straight-chino",
    name: "Straight Chino",
    category: "pants",
    fit: "Straight fit",
    fabric: "Cotton twill",
    price: 2850,
    offerPrice: 2390,
    images: ["/images/p-stone-chino.png"],
    colors: [{ name: "Stone", swatch: "#B9AE97" }],
    sizes: PANT_SIZES,
    unavailableSizes: ["30"],
    availability: "in_stock",
    badges: ["sale"],
    rating: 4.5,
    reviewCount: 74,
    shortDescription:
      "A relaxed straight leg in garment-washed twill. Easy, unfussy and right with almost everything.",
    details: [
      "Garment-washed for a broken-in feel",
      "Straight leg from hip to hem",
      "Belt loops sized for 35 mm belts",
      "Reinforced pocket bags",
    ],
    specs: pantSpecs("100% cotton twill", "Mid rise"),
    completeLook: ["camp-collar-linen-shirt", "indigo-linen-shirt"],
    createdAt: "2026-04-11",
  },
  {
    id: "p09",
    slug: "pleated-wool-blend-trouser",
    name: "Pleated Wool-Blend Trouser",
    category: "pants",
    fit: "Relaxed taper",
    fabric: "Wool-poly blend",
    price: 3950,
    images: ["/images/p-charcoal-trouser.png"],
    colors: [{ name: "Charcoal", swatch: "#44474D" }],
    sizes: PANT_SIZES,
    unavailableSizes: [],
    availability: "in_stock",
    badges: ["new"],
    rating: 4.7,
    reviewCount: 18,
    shortDescription:
      "Single forward pleat, extended waistband tab and a fluid drape. Formal without feeling stiff.",
    details: [
      "Lightweight tropical wool blend",
      "Single forward pleat",
      "Extended tab with internal adjusters",
      "Pressed crease that holds",
    ],
    specs: pantSpecs("60% polyester, 40% wool", "High rise"),
    completeLook: ["slim-poplin-dress-shirt", "striped-poplin-shirt"],
    createdAt: "2026-10-01",
  },
  {
    id: "p10",
    slug: "utility-cargo-pant",
    name: "Utility Cargo Pant",
    category: "pants",
    fit: "Relaxed fit",
    fabric: "Cotton ripstop",
    price: 3250,
    images: ["/images/p-olive-cargo.png"],
    colors: [{ name: "Olive", swatch: "#5B6142" }],
    sizes: PANT_SIZES,
    unavailableSizes: PANT_SIZES,
    availability: "out_of_stock",
    badges: [],
    rating: 4.3,
    reviewCount: 37,
    shortDescription:
      "Hard-wearing ripstop with low-profile cargo pockets and an adjustable hem. Restocking soon.",
    details: [
      "Durable cotton ripstop",
      "Flat bellows cargo pockets",
      "Drawcord hem",
      "Gusseted crotch for movement",
    ],
    specs: pantSpecs("100% cotton ripstop", "Mid rise"),
    completeLook: ["camp-collar-linen-shirt", "brushed-check-shirt"],
    createdAt: "2026-01-08",
  },
  {
    id: "p11",
    slug: "selvedge-straight-jean",
    name: "Selvedge Straight Jean",
    category: "pants",
    fit: "Straight fit",
    fabric: "13.5 oz selvedge denim",
    price: 4250,
    images: ["/images/p-indigo-denim.png"],
    colors: [{ name: "Raw indigo", swatch: "#1F2A4A" }],
    sizes: PANT_SIZES,
    unavailableSizes: ["38"],
    availability: "low_stock",
    stockLeft: 3,
    badges: [],
    rating: 4.9,
    reviewCount: 52,
    shortDescription:
      "Unwashed rope-dyed selvedge that fades to your life. Expect it to relax half a size in the waist.",
    details: [
      "13.5 oz rope-dyed selvedge denim",
      "Button fly with copper rivets",
      "Straight leg, mid rise",
      "Soak before first wear for best fit",
    ],
    specs: pantSpecs("100% cotton selvedge denim", "Mid rise"),
    completeLook: ["classic-oxford-shirt", "brushed-check-shirt"],
    createdAt: "2026-07-07",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => Boolean(product));
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function effectivePrice(product: Pick<Product, "price" | "offerPrice">) {
  return product.offerPrice ?? product.price;
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}
