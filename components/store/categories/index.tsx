import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import CategoriesGrid from "./categories-grid";

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
    take: 8,
  });
}

export default async function Categories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Browse
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-900">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-2 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors group"
        >
          All Categories
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <CategoriesGrid categories={categories} />
    </section>
  );
}
