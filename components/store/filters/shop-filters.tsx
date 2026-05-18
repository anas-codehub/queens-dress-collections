"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PRICE_RANGES = [
  { label: "Under ৳3,000", min: 0, max: 3000 },
  { label: "৳3,000 — ৳6,000", min: 3000, max: 6000 },
  { label: "৳6,000 — ৳10,000", min: 6000, max: 10000 },
  { label: "৳10,000 — ৳15,000", min: 10000, max: 15000 },
  { label: "Over ৳15,000", min: 15000, max: 999999 },
];

type Props = {
  categories: { id: string; name: string; slug: string }[];
  colors: string[];
};

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brand-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-[11px] text-brand-800 tracking-[0.15em] uppercase font-medium">
          {title}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={1.5}
          className={`text-brand-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopFilters({ categories, colors }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.get("categories")?.split(",").filter(Boolean) ?? [],
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    params.get("sizes")?.split(",").filter(Boolean) ?? [],
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    params.get("colors")?.split(",").filter(Boolean) ?? [],
  );
  const [selectedPrice, setSelectedPrice] = useState<string>(
    params.get("price") ?? "",
  );

  function applyFilters(
    cats: string[],
    sizes: string[],
    colrs: string[],
    price: string,
  ) {
    const p = new URLSearchParams();
    if (cats.length) p.set("categories", cats.join(","));
    if (sizes.length) p.set("sizes", sizes.join(","));
    if (colrs.length) p.set("colors", colrs.join(","));
    if (price) p.set("price", price);
    router.push(`/shop?${p.toString()}`);
  }

  function toggleCategory(cat: string) {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    applyFilters(updated, selectedSizes, selectedColors, selectedPrice);
  }

  function toggleSize(size: string) {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    applyFilters(selectedCategories, updated, selectedColors, selectedPrice);
  }

  function toggleColor(color: string) {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updated);
    applyFilters(selectedCategories, selectedSizes, updated, selectedPrice);
  }

  function handlePrice(price: string) {
    const updated = selectedPrice === price ? "" : price;
    setSelectedPrice(updated);
    applyFilters(selectedCategories, selectedSizes, selectedColors, updated);
  }

  function clearAll() {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPrice("");
    router.push("/shop");
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    !!selectedPrice;

  const filterContent = (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-brand-800 tracking-[0.15em] uppercase font-medium">
          Filters
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] text-brand-500 hover:text-brand-900 underline tracking-wide transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                onClick={() => toggleCategory(cat.slug)}
                className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  selectedCategories.includes(cat.slug)
                    ? "bg-brand-900 border-brand-900"
                    : "border-brand-400 group-hover:border-brand-700"
                }`}
              >
                {selectedCategories.includes(cat.slug) && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path
                      d="M1 3L3 5L7 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat.slug)}
                className="text-[11px] text-brand-600 group-hover:text-brand-900 tracking-wide transition-colors cursor-pointer"
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 text-[11px] tracking-wide border transition-colors ${
                selectedSizes.includes(size)
                  ? "bg-brand-900 border-brand-900 text-brand-50"
                  : "border-brand-300 text-brand-600 hover:border-brand-700 hover:text-brand-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      {colors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-col gap-2">
            {colors.map((color) => (
              <label
                key={color}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  onClick={() => toggleColor(color)}
                  className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    selectedColors.includes(color)
                      ? "bg-brand-900 border-brand-900"
                      : "border-brand-400 group-hover:border-brand-700"
                  }`}
                >
                  {selectedColors.includes(color) && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => toggleColor(color)}
                  className="text-[11px] text-brand-600 group-hover:text-brand-900 tracking-wide transition-colors cursor-pointer"
                >
                  {color}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection title="Price">
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                onClick={() => handlePrice(range.label)}
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  selectedPrice === range.label
                    ? "bg-brand-900 border-brand-900"
                    : "border-brand-400 group-hover:border-brand-700"
                }`}
              >
                {selectedPrice === range.label && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                onClick={() => handlePrice(range.label)}
                className="text-[11px] text-brand-600 group-hover:text-brand-900 tracking-wide transition-colors cursor-pointer"
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">{filterContent}</div>

      {/* Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-[11px] text-brand-700 tracking-[0.12em] uppercase border border-brand-300 px-4 py-2.5 mb-4"
        >
          <SlidersHorizontal size={13} strokeWidth={1.5} />
          Filters{" "}
          {hasFilters &&
            `(${selectedCategories.length + selectedSizes.length + selectedColors.length + (selectedPrice ? 1 : 0)})`}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-72 bg-brand-50 z-50 overflow-y-auto p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-brand-900 tracking-wide">
                    Filters
                  </p>
                  <button onClick={() => setMobileOpen(false)}>
                    <X size={18} strokeWidth={1.5} className="text-brand-500" />
                  </button>
                </div>
                {filterContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
