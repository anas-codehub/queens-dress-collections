"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const filters = {
  Categories: [
    "Maxi Dresses",
    "Midi Dresses",
    "Mini Dresses",
    "Evening Gowns",
    "Casual Dresses",
    "Co-ord Sets",
  ],
  Sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  Colors: [
    { name: "Nude", hex: "#c8b8a0" },
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#f5f0ea" },
    { name: "Beige", hex: "#e8d5b0" },
    { name: "Brown", hex: "#7a5c3a" },
    { name: "Cream", hex: "#f0ebe3" },
  ],
};

const priceRanges = [
  { label: "Under ৳3,000", min: 0, max: 3000 },
  { label: "৳3,000 — ৳6,000", min: 3000, max: 6000 },
  { label: "৳6,000 — ৳10,000", min: 6000, max: 10000 },
  { label: "৳10,000 — ৳15,000", min: 10000, max: 15000 },
  { label: "Over ৳15,000", min: 15000, max: 99999 },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

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

export default function ShopFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  function toggleItem(
    item: string,
    list: string[],
    setList: (v: string[]) => void,
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  }

  function clearAll() {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPrice(null);
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedPrice !== null;

  return (
    <div>
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-brand-800 tracking-[0.15em] uppercase font-medium">
          Filters
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] text-brand-500 hover:text-brand-900 tracking-wide underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {filters.Categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                onClick={() =>
                  toggleItem(cat, selectedCategories, setSelectedCategories)
                }
                className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors cursor-pointer ${
                  selectedCategories.includes(cat)
                    ? "bg-brand-900 border-brand-900"
                    : "border-brand-400 group-hover:border-brand-700"
                }`}
              >
                {selectedCategories.includes(cat) && (
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
                onClick={() =>
                  toggleItem(cat, selectedCategories, setSelectedCategories)
                }
                className="text-[11px] text-brand-600 group-hover:text-brand-900 tracking-wide transition-colors cursor-pointer"
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {filters.Sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleItem(size, selectedSizes, setSelectedSizes)}
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
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2.5">
          {filters.Colors.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                toggleItem(color.name, selectedColors, setSelectedColors)
              }
              title={color.name}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                selectedColors.includes(color.name)
                  ? "border-brand-900 scale-110"
                  : "border-transparent hover:border-brand-400"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="flex flex-col gap-2">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                onClick={() =>
                  setSelectedPrice(
                    selectedPrice === range.label ? null : range.label,
                  )
                }
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
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
                onClick={() =>
                  setSelectedPrice(
                    selectedPrice === range.label ? null : range.label,
                  )
                }
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
}
