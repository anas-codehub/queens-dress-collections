"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BG_COLORS = [
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-100",
  "bg-brand-400",
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-100",
  "bg-brand-400",
];

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
};

export default function CategoriesGrid({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Link
            href={`/shop?categories=${cat.slug}`}
            className={`group relative ${BG_COLORS[i % BG_COLORS.length]} aspect-[3/4] flex flex-col justify-end p-5 overflow-hidden block`}
          >
            {/* Category Image */}
            {cat.image && (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-brand-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

            {/* Bottom content */}
            <div className="relative z-10">
              <p
                className={`text-[9px] tracking-[0.15em] uppercase mb-1 ${cat.image ? "text-brand-300" : "text-brand-600"}`}
              >
                {cat._count.products} style
                {cat._count.products !== 1 ? "s" : ""}
              </p>
              <h3
                className={`font-serif text-lg leading-tight mb-3 ${cat.image ? "text-white" : "text-brand-900"}`}
              >
                {cat.name}
              </h3>
              <span
                className={`flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase group-hover:gap-3 transition-all duration-300 ${cat.image ? "text-brand-200" : "text-brand-700"}`}
              >
                Shop Now
                <ArrowRight size={11} strokeWidth={1.5} />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
