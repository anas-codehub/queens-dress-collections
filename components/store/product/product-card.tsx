"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null | undefined;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
};

export default function ProductCard({
  product,
  small = false,
}: {
  product: Product;
  small?: boolean;
}) {
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col"
    >
      {/* Image — clicking goes to product detail */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative bg-brand-200 aspect-[3/4] overflow-hidden mb-3">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-4xl text-brand-400 select-none">
                QDC
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-brand-900 text-brand-100 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1">
                New
              </span>
            )}
            {product.isSale && discount && (
              <span className="bg-amber-700 text-amber-50 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <p
            className={`text-brand-500 tracking-[0.12em] uppercase mb-1 ${small ? "text-[8px]" : "text-[9px]"}`}
          >
            {product.category}
          </p>
          <h3
            className={`text-brand-800 tracking-wide mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 ${small ? "text-xs" : "text-sm"}`}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`font-medium text-brand-900 ${small ? "text-xs" : "text-sm"}`}
            >
              ৳{product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-brand-400 line-through">
                ৳{product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Buy Now button — goes to product detail page */}
      <Link
        href={`/product/${product.slug}`}
        className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-900 text-brand-100 text-[10px] tracking-[0.15em] uppercase py-2.5 hover:bg-brand-800 transition-colors"
      >
        <Zap size={12} strokeWidth={1.5} />
        Buy Now
      </Link>
    </motion.div>
  );
}
