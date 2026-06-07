"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/store/product/product-card";
import { trackEvent } from "@/components/shared/meta-pixel";

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

export default function SearchClient({
  query,
  products,
}: {
  query: string;
  products: Product[];
}) {
  const router = useRouter();
  const [input, setInput] = useState(query);
  const [isPending, startTransition] = useTransition();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim().length > 2) {
        trackEvent("Search", { search_string: input.trim() });
        startTransition(() => {
          router.push(
            input.trim()
              ? `/search?q=${encodeURIComponent(input.trim())}`
              : "/search",
          );
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div>
      {/* Search Header */}
      <div className="mb-8 pb-6 border-b border-brand-300">
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          Search
        </p>
        <h1 className="font-serif text-3xl lg:text-4xl text-brand-900 mb-6">
          Find your perfect dress
        </h1>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search
            size={18}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search dresses, styles, occasions..."
            autoFocus
            className="w-full bg-brand-100 border border-brand-300 pl-12 pr-12 py-4 text-sm text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
          />
          {input && (
            <button
              onClick={() => {
                setInput("");
                router.push("/search");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-900 transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {/* No query yet */}
        {!query && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <Search
              size={48}
              strokeWidth={1}
              className="text-brand-300 mx-auto mb-4"
            />
            <p className="font-serif text-2xl text-brand-700 mb-2">
              What are you looking for?
            </p>
            <p className="text-xs text-brand-400 tracking-wide">
              Search by dress name, style, or occasion
            </p>

            {/* Popular searches */}
            <div className="mt-8">
              <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Three Piece", "Two Piece"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setInput(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-4 py-2 border border-brand-300 text-xs text-brand-600 hover:bg-brand-200 hover:text-brand-900 tracking-wide transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-brand-400 tracking-wide">Searching...</p>
          </motion.div>
        )}

        {/* No results */}
        {query && !isPending && products.length === 0 && (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <p className="font-serif text-2xl text-brand-700 mb-2">
              No results for "{query}"
            </p>
            <p className="text-xs text-brand-400 tracking-wide mb-8">
              Try a different search term or browse our collections
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Maxi Dress", "Evening Gown", "Casual", "Co-ord Set"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setInput(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-4 py-2 border border-brand-300 text-xs text-brand-600 hover:bg-brand-200 hover:text-brand-900 tracking-wide transition-colors"
                  >
                    {term}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        )}

        {/* Results grid */}
        {query && !isPending && products.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-brand-500 tracking-wide">
                <span className="font-medium text-brand-900">
                  {products.length}
                </span>{" "}
                result{products.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-brand-900">"{query}"</span>
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
