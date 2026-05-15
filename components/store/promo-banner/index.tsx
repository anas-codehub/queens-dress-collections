"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="bg-brand-900 py-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[10px] text-brand-500 tracking-[0.3em] uppercase mb-4">
          Limited Time
        </p>
        <h2 className="font-serif text-4xl lg:text-6xl text-brand-100 leading-tight mb-4">
          The Summer Edit
        </h2>
        <p className="text-xs text-brand-500 tracking-[0.12em] mb-8 max-w-sm mx-auto leading-relaxed">
          Up to 40% off selected styles — this week only. Don't miss out on our
          most loved pieces.
        </p>
        <Link
          href="/sale"
          className="group inline-flex items-center gap-2 border border-brand-600 text-brand-300 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 hover:border-brand-400 transition-all duration-300"
        >
          Shop the Sale
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </motion.div>
    </section>
  );
}
