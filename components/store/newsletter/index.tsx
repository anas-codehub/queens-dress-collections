"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("You're on the list! Welcome to the Queens circle.");
    setEmail("");
    setLoading(false);
  }

  return (
    <section className="bg-brand-200 py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="text-[10px] text-brand-500 tracking-[0.3em] uppercase mb-3">
          Stay in the loop
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-brand-900 mb-3">
          Join the Queens Circle
        </h2>
        <p className="text-xs text-brand-600 tracking-wide leading-relaxed mb-8">
          Get early access to new arrivals, exclusive offers, and style
          inspiration — straight to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-brand-50 border border-brand-400 px-4 py-3.5 text-xs text-brand-900 placeholder:text-brand-400 tracking-wide outline-none focus:border-brand-700 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="group bg-brand-900 text-brand-100 text-[10px] tracking-[0.18em] uppercase px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-brand-800 transition-colors disabled:opacity-70"
          >
            {loading ? "Joining..." : "Subscribe"}
            {!loading && (
              <ArrowRight
                size={12}
                strokeWidth={1.5}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <p className="text-[9px] text-brand-400 tracking-wide mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
