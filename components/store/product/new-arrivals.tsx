import { db } from "@/lib/db";
import ProductCard from "./product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getNewArrivals() {
  return db.product.findMany({
    where: { isActive: true, isNew: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
  });
}

export default async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Just In
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-900">
            New Arrivals
          </h2>
        </div>
        <Link
          href="/new-arrivals"
          className="hidden sm:flex items-center gap-2 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors group"
        >
          View All
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xs text-brand-400 tracking-wide">
            No new arrivals yet — add products in the admin panel
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                comparePrice: product.comparePrice ?? undefined,
                image: product.images[0]?.url ?? "",
                category: product.category.name,
                isNew: product.isNew,
                isSale: !!product.comparePrice,
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/new-arrivals"
          className="inline-flex items-center gap-2 text-[11px] text-brand-600 tracking-[0.12em] uppercase border-b border-brand-400 pb-0.5"
        >
          View All
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
