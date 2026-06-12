"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/store/product/product-card";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null | undefined;
  image: string;
  category: string;
  isNew: boolean;
  isSale: boolean;
};

const sortOptions = [
  "Featured",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

export default function ShopGrid({
  products,
  page,
  totalPages,
  totalCount,
}: {
  products: Product[];
  page: number;
  totalPages: number;
  totalCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);

  const sorted = [...products].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  function goToPage(p: number) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", p.toString());
    router.push(`/shop?${newParams.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200">
        <p className="text-[11px] text-brand-500 tracking-wide">
          {totalCount} product{totalCount !== 1 ? "s" : ""}
          {totalPages > 1 && ` — Page ${page} of ${totalPages}`}
        </p>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 text-[11px] text-brand-700 tracking-[0.12em] uppercase"
          >
            Sort: {sort}
            <ChevronDown
              size={12}
              strokeWidth={1.5}
              className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 bg-brand-50 border border-brand-300 min-w-48 z-20 py-1">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-[11px] tracking-wide transition-colors ${
                    sort === option
                      ? "text-brand-900 bg-brand-200"
                      : "text-brand-600 hover:bg-brand-100 hover:text-brand-900"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid — 3 cols desktop, 2 cols mobile, smaller cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xs text-brand-400 tracking-wide">
            No products found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} small />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 pt-8 border-t border-brand-200">
          {/* Prev */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center border border-brand-300 text-brand-600 hover:border-brand-700 hover:text-brand-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) return true;
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(p - page) <= 2) return true;
              return false;
            })
            .reduce((acc: (number | string)[], p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="text-brand-400 text-xs px-1">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={`w-9 h-9 text-[11px] tracking-wide border transition-colors ${
                    page === p
                      ? "bg-brand-900 border-brand-900 text-brand-100"
                      : "border-brand-300 text-brand-600 hover:border-brand-700 hover:text-brand-900"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

          {/* Next */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-brand-300 text-brand-600 hover:border-brand-700 hover:text-brand-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
