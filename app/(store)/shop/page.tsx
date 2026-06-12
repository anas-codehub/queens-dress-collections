import { db } from "@/lib/db";
import { Suspense } from "react";
import ShopFilters from "@/components/store/filters/shop-filters";
import ShopGrid from "@/components/store/filters/shop-grid";

export const metadata = {
  title: "Shop",
  description: "Browse our full collection of women's dresses and styles.",
};

const PRODUCTS_PER_PAGE = 50;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    categories?: string;
    sizes?: string;
    colors?: string;
    price?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const catSlugs = params.categories?.split(",").filter(Boolean) ?? [];
  const sizes = params.sizes?.split(",").filter(Boolean) ?? [];
  const colors = params.colors?.split(",").filter(Boolean) ?? [];
  const priceRange = params.price ?? "";
  const page = parseInt(params.page ?? "1");

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

  const where: any = { isActive: true };
  if (catSlugs.length > 0) where.category = { slug: { in: catSlugs } };
  if (sizes.length > 0)
    where.variants = { some: { size: { in: sizes }, stock: { gt: 0 } } };
  if (colors.length > 0)
    where.variants = {
      ...where.variants,
      some: { ...(where.variants?.some ?? {}), color: { in: colors } },
    };
  if (minPrice !== undefined && maxPrice !== undefined)
    where.price = { gte: minPrice, lte: maxPrice };

  const [products, totalCount, categories, allColors] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PRODUCTS_PER_PAGE,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        variants: true,
      },
    }),
    db.product.count({ where }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.productVariant.findMany({
      where: { color: { not: null } },
      select: { color: true },
      distinct: ["color"],
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
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
            {totalCount} product{totalCount !== 1 ? "s" : ""}
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
          <ShopGrid
            products={mappedProducts}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
          />
        </div>
      </div>
    </div>
  );
}
