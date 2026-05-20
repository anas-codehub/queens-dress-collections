import { db } from "@/lib/db";
import { Suspense } from "react";
import ShopFilters from "@/components/store/filters/shop-filters";
import ShopGrid from "@/components/store/filters/shop-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Dresses",
  description:
    "Browse our full collection of women's dresses — maxi, midi, evening gowns, casual dresses and co-ord sets. Filter by size, color and price.",
  openGraph: {
    title: "Shop All Dresses | Queens Dress Collection",
    description: "Browse our full collection of women's dresses.",
    url: "/shop",
  },
};
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    categories?: string;
    sizes?: string;
    colors?: string;
    price?: string;
  }>;
}) {
  const params = await searchParams;
  const catSlugs = params.categories?.split(",").filter(Boolean) ?? [];
  const sizes = params.sizes?.split(",").filter(Boolean) ?? [];
  const colors = params.colors?.split(",").filter(Boolean) ?? [];
  const priceRange = params.price ?? "";

  // Parse price range
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  if (priceRange) {
    if (priceRange.includes("Under")) {
      minPrice = 0;
      maxPrice = 3000;
    } else if (priceRange.includes("Over")) {
      minPrice = 15000;
      maxPrice = 999999;
    } else {
      const match = priceRange.match(/৳([\d,]+)\s*—\s*৳([\d,]+)/);
      if (match) {
        minPrice = parseInt(match[1].replace(",", ""));
        maxPrice = parseInt(match[2].replace(",", ""));
      }
    }
  }

  // Build where clause
  const where: any = { isActive: true };

  if (catSlugs.length > 0) {
    where.category = { slug: { in: catSlugs } };
  }

  if (sizes.length > 0) {
    where.variants = { some: { size: { in: sizes }, stock: { gt: 0 } } };
  }

  if (colors.length > 0) {
    where.variants = {
      ...where.variants,
      some: {
        ...(where.variants?.some ?? {}),
        color: { in: colors },
      },
    };
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    where.price = { gte: minPrice, lte: maxPrice };
  }

  const [products, categories, allColors] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        variants: true,
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    // Get all unique colors from variants
    db.productVariant.findMany({
      where: { color: { not: null } },
      select: { color: true },
      distinct: ["color"],
    }),
  ]);

  const uniqueColors = allColors
    .map((v) => v.color!)
    .filter(Boolean)
    .sort();

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    image: p.images[0]?.url ?? "",
    category: p.category.name,
    isNew: p.isNew,
    isSale: !!p.comparePrice,
  }));

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10">
      <div className="mb-8 pb-6 border-b border-brand-300">
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          Browse
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-serif text-3xl lg:text-4xl text-brand-900">
            All Products
          </h1>
          <p className="text-xs text-brand-500 tracking-wide hidden sm:block">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-56 shrink-0">
          <Suspense>
            <ShopFilters categories={categories} colors={uniqueColors} />
          </Suspense>
        </aside>
        <div className="flex-1">
          <ShopGrid products={mappedProducts} />
        </div>
      </div>
    </div>
  );
}
