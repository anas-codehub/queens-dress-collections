import { Suspense } from "react";
import ShopFilters from "@/components/store/filters/shop-filters";
import ShopGrid from "@/components/store/filters/shop-grid";

export const metadata = {
  title: "Shop",
  description: "Browse our full collection of women's dresses and styles.",
};

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-brand-300">
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          Browse
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-serif text-3xl lg:text-4xl text-brand-900">
            All Products
          </h1>
          <p className="text-xs text-brand-500 tracking-wide hidden sm:block">
            Showing 24 products
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-56 shrink-0">
          <Suspense>
            <ShopFilters />
          </Suspense>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <Suspense>
            <ShopGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
