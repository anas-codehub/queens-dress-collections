"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-brand-200 min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background texture — subtle grain */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />

      {/* Top label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[10px] text-brand-600 tracking-[0.35em] uppercase mb-8"
      >
        Summer Collection 2026
      </motion.p>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-serif text-5xl sm:text-6xl lg:text-8xl text-brand-900 text-center leading-[1.1] tracking-[0.02em] mb-6 max-w-4xl"
      >
        Dressed for
        <br />
        <em className="italic text-brand-700">the woman</em>
        <br />
        you are
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xs text-brand-600 tracking-[0.12em] text-center max-w-sm leading-relaxed mb-10"
      >
        Timeless silhouettes and luxurious fabrics,
        <br />
        crafted exclusively for her.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link
          href="/shop"
          className="group flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 transition-colors duration-300"
        >
          Shop Collection
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
        <Link
          href="/collections"
          className="text-[11px] text-brand-700 tracking-[0.18em] uppercase px-8 py-4 border border-brand-500 hover:border-brand-900 hover:text-brand-900 transition-colors duration-300"
        >
          View Lookbook
        </Link>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center gap-12 sm:gap-20"
      >
        {[
          { value: "500+", label: "Styles" },
          { value: "Free", label: "Returns" },
          { value: "48hr", label: "Delivery" },
          { value: "4.9★", label: "Rating" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-serif text-lg text-brand-900">{stat.value}</p>
            <p className="text-[9px] text-brand-500 tracking-[0.15em] uppercase mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
