"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
export default function PromoBanner({
  settings,
}: {
  settings: Record<string, string>;
}) {
  return (
    <section className="bg-brand-900 py-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {settings.promoBannerTag ?? "Limited Time"}
        {settings.promoBannerTitle ?? "The Summer Edit"}
        {settings.promoBannerText ??
          "Up to 40% off selected styles — this week only."}
        <Link
          href={settings.promoBannerLink ?? "/sale"}
          className="group inline-flex items-center gap-2 border border-brand-600 text-brand-300 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 hover:border-brand-400 transition-all duration-300"
        >
          {settings.promoBannerCta ?? "Shop the Sale"}
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
