"use client";

import { useState } from "react";
import ProductCard from "@/components/store/product/product-card";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const sortOptions = [
  "Featured",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

// Placeholder products — will come from DB later
const products = [
  {
    id: "1",
    name: "Linen Wrap Dress",
    slug: "linen-wrap-dress",
    price: 7200,
    comparePrice: undefined,
    image: "",
    category: "Casual",
    isNew: true,
    isSale: false,
  },
  {
    id: "2",
    name: "Satin Midi Dress",
    slug: "satin-midi-dress",
    price: 5400,
    comparePrice: 8200,
    image: "",
    category: "Evening",
    isNew: false,
    isSale: true,
  },
  {
    id: "3",
    name: "Floral Maxi Dress",
    slug: "floral-maxi-dress",
    price: 6800,
    comparePrice: undefined,
    image: "",
    category: "Summer",
    isNew: true,
    isSale: false,
  },
  {
    id: "4",
    name: "Cream Blazer Dress",
    slug: "cream-blazer-dress",
    price: 9500,
    comparePrice: undefined,
    image: "",
    category: "Office",
    isNew: true,
    isSale: false,
  },
  {
    id: "5",
    name: "Beige Slip Dress",
    slug: "beige-slip-dress",
    price: 4900,
    comparePrice: undefined,
    image: "",
    category: "Minimal",
    isNew: false,
    isSale: false,
  },
  {
    id: "6",
    name: "Nude Pleated Gown",
    slug: "nude-pleated-gown",
    price: 14200,
    comparePrice: 18000,
    image: "",
    category: "Occasion",
    isNew: false,
    isSale: true,
  },
  {
    id: "7",
    name: "Ivory Co-ord Set",
    slug: "ivory-coord-set",
    price: 8800,
    comparePrice: undefined,
    image: "",
    category: "Co-ords",
    isNew: false,
    isSale: false,
  },
  {
    id: "8",
    name: "Camel Wrap Midi",
    slug: "camel-wrap-midi",
    price: 6200,
    comparePrice: 7500,
    image: "",
    category: "Casual",
    isNew: false,
    isSale: true,
  },
  {
    id: "9",
    name: "Sand Linen Co-ord",
    slug: "sand-linen-coord",
    price: 7800,
    comparePrice: undefined,
    image: "",
    category: "Co-ords",
    isNew: true,
    isSale: false,
  },
  {
    id: "10",
    name: "Taupe Evening Gown",
    slug: "taupe-evening-gown",
    price: 16500,
    comparePrice: undefined,
    image: "",
    category: "Evening",
    isNew: true,
    isSale: false,
  },
  {
    id: "11",
    name: "Stone Wrap Dress",
    slug: "stone-wrap-dress",
    price: 5900,
    comparePrice: 7200,
    image: "",
    category: "Casual",
    isNew: false,
    isSale: true,
  },
  {
    id: "12",
    name: "Ecru Maxi Dress",
    slug: "ecru-maxi-dress",
    price: 8200,
    comparePrice: undefined,
    image: "",
    category: "Summer",
    isNew: true,
    isSale: false,
  },
];

export default function ShopGrid() {
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200">
        {/* Mobile filter button */}
        <button
          onClick={() => setMobileFilters(!mobileFilters)}
          className="lg:hidden flex items-center gap-2 text-[11px] text-brand-700 tracking-[0.12em] uppercase border border-brand-300 px-3 py-2"
        >
          <SlidersHorizontal size={13} strokeWidth={1.5} />
          Filters
        </button>

        <p className="hidden lg:block text-[11px] text-brand-500 tracking-wide">
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
