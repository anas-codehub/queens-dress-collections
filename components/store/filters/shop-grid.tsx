"use client";

import { useState } from "react";
import ProductCard from "@/components/store/product/product-card";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

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

export default function ShopGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);

  const sorted = [...products].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200">
        <p className="text-[11px] text-brand-500 tracking-wide">
          {products.length} products
        </p>

        {/* Sort */}
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

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xs text-brand-400 tracking-wide">
            No products found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
