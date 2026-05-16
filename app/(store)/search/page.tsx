import { db } from "@/lib/db";
import SearchClient from "@/components/store/search/search-client";

export const metadata = {
  title: "Search",
  description: "Search our collection of women's dresses and styles.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query
    ? await db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { has: query.toLowerCase() } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10">
      <SearchClient
        query={query}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          comparePrice: p.comparePrice,
          image: p.images[0]?.url ?? "",
          category: p.category.name,
          isNew: p.isNew,
          isSale: !!p.comparePrice,
        }))}
      />
    </div>
  );
}
