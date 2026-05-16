import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/forms/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        coupons: true,
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Products
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Edit Product</h1>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
