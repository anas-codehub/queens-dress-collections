import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function AdminTopProducts() {
  const products = await db.product.findMany({
    take: 6,
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div className="bg-white border border-brand-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] text-brand-800 tracking-[0.15em] uppercase font-medium">
          Latest Products
        </h2>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-[10px] text-brand-500 hover:text-brand-900 tracking-wide transition-colors"
        >
          View all <ArrowRight size={11} strokeWidth={1.5} />
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-xs text-brand-400 tracking-wide py-4 text-center">
          No products yet
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="flex items-center gap-3 py-3 border-b border-brand-100 hover:bg-brand-50 -mx-2 px-2 transition-colors"
            >
              <div className="w-10 h-12 bg-brand-200 flex items-center justify-center shrink-0">
                <span className="font-serif text-xs text-brand-400">QDC</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-800 font-medium tracking-wide truncate">
                  {product.name}
                </p>
                <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                  {product.category.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-brand-900">
                  ৳{product.price.toLocaleString()}
                </p>
                {product.isNew && (
                  <span className="text-[9px] text-green-600 tracking-wide">
                    New
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
