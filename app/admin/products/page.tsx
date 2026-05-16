import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import AdminProductsTable from "@/components/admin/tables/products-table";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
      variants: true,
    },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
            Manage
          </p>
          <h1 className="font-serif text-3xl text-brand-900">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-brand-800 transition-colors"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add Product
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white border border-brand-300 pl-9 pr-4 py-2.5 text-xs text-brand-800 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
          />
        </div>
        <div className="text-[10px] text-brand-500 tracking-wide">
          {products.length} products
        </div>
      </div>

      {/* Table */}
      <AdminProductsTable products={products} />
    </div>
  );
}
