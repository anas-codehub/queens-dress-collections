import { db } from "@/lib/db";
import ProductForm from "@/components/admin/forms/product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Products
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Add New Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
