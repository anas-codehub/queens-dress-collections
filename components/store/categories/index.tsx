"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Maxi Dresses",
    href: "/shop/maxi-dresses",
    count: "124 styles",
    bg: "bg-brand-200",
  },
  {
    label: "Evening Gowns",
    href: "/shop/evening-gowns",
    count: "86 styles",
    bg: "bg-brand-300",
  },
  {
    label: "Casual Dresses",
    href: "/shop/casual-dresses",
    count: "210 styles",
    bg: "bg-brand-100",
  },
  {
    label: "Co-ord Sets",
    href: "/shop/coord-sets",
    count: "64 styles",
    bg: "bg-brand-400",
  },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Browse
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-900">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-2 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors group"
        >
          All Categories
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={cat.href}
              className={`group relative ${cat.bg} aspect-[3/4] flex flex-col justify-end p-5 overflow-hidden block`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              {/* Bottom content */}
              <div>
                <p className="text-[9px] text-brand-600 tracking-[0.15em] uppercase mb-1">
                  {cat.count}
                </p>
                <h3 className="font-serif text-lg text-brand-900 leading-tight mb-3">
                  {cat.label}
                </h3>
                <span className="flex items-center gap-2 text-[10px] text-brand-700 tracking-[0.12em] uppercase group-hover:gap-3 transition-all duration-300">
                  Shop Now
                  <ArrowRight size={11} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
