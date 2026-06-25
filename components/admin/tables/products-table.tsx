"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  isActive: boolean;
  isNew: boolean;
  isFeatured: boolean;
  category: { name: string };
  images: { url: string }[];
  variants: { stock: number }[];
};

export default function AdminProductsTable({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const totalStock = (variants: { stock: number }[]) =>
    variants.reduce((sum, v) => sum + v.stock, 0);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleActive(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (!res.ok) throw new Error();
      toast.success(current ? "Product hidden" : "Product published");
      router.refresh();
    } catch {
      toast.error("Failed to update product");
    }
  }

  return (
    <div className="bg-white border border-brand-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-200 bg-brand-50">
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Product
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Category
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Price
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Stock
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Status
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-xs text-brand-400 tracking-wide"
                >
                  No products yet. Add your first product!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                >
                  {/* Product */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-brand-200 flex items-center justify-center shrink-0">
                        <span className="font-serif text-xs text-brand-400">
                          QDC
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-brand-800 font-medium tracking-wide">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                          {product.slug}
                        </p>
                        <div className="flex gap-1.5 mt-1">
                          {product.isNew && (
                            <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 tracking-wide uppercase">
                              New
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 tracking-wide uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span className="text-xs text-brand-600 tracking-wide">
                      {product.category.name}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-brand-900">
                      ৳{product.price.toLocaleString()}
                    </p>
                    {product.comparePrice && (
                      <p className="text-[10px] text-brand-400 line-through mt-0.5">
                        ৳{product.comparePrice.toLocaleString()}
                      </p>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-medium ${
                        totalStock(product.variants) === 0
                          ? "text-red-500"
                          : totalStock(product.variants) < 10
                            ? "text-amber-600"
                            : "text-green-600"
                      }`}
                    >
                      {totalStock(product.variants)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() =>
                        handleToggleActive(product.id, product.isActive)
                      }
                      className="flex items-center gap-1.5 group"
                    >
                      {product.isActive ? (
                        <ToggleRight
                          size={18}
                          strokeWidth={1.5}
                          className="text-green-500"
                        />
                      ) : (
                        <ToggleLeft
                          size={18}
                          strokeWidth={1.5}
                          className="text-brand-400"
                        />
                      )}
                      <span
                        className={`text-[10px] tracking-wide ${
                          product.isActive ? "text-green-600" : "text-brand-400"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                        title="View"
                      >
                        <Eye size={14} strokeWidth={1.5} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} strokeWidth={1.5} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="p-1.5 text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
                          );
                          toast.success("Product link copied!");
                        }}
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                        title="Copy product link"
                      >
                        <Copy size={13} strokeWidth={1.5} />
                      </button>

                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                        title="View product"
                      >
                        <ExternalLink size={13} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
