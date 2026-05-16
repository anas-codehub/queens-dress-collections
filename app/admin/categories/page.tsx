import { db } from "@/lib/db";
import AdminCategoriesClient from "@/components/admin/categories/categories-client";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Categories</h1>
      </div>
      <AdminCategoriesClient categories={categories} />
    </div>
  );
}
