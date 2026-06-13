"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      setDone(true);
      toast.success("We'll notify you when it's ready!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[10px] text-brand-500 hover:text-brand-300 tracking-[0.15em] uppercase transition-colors"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Back to Store
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg relative z-10"
      >
        {/* Logo */}
        <p className="font-serif text-3xl tracking-[0.3em] text-brand-300 uppercase mb-2">
          QDC
        </p>

        {/* Tag */}
        <p className="text-[10px] text-brand-500 tracking-[0.3em] uppercase mb-8">
          Queens Dress Collection
        </p>

        {/* Headline */}
        <h1 className="font-serif text-5xl lg:text-6xl text-brand-100 leading-tight mb-4">
          Something
          <br />
          <em className="italic text-brand-400">Beautiful</em>
          <br />
          is Coming
        </h1>

        <p className="text-xs text-brand-500 tracking-wide leading-relaxed mb-10 max-w-sm mx-auto">
          We're working on something special for you. Leave your email and be
          the first to know when it's ready.
        </p>

        {/* Email form */}
        {!done ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-0 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-brand-800 border border-brand-700 px-4 py-3.5 text-xs text-brand-100 placeholder:text-brand-600 outline-none focus:border-brand-500 transition-colors tracking-wide"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-300 text-brand-950 text-[10px] tracking-[0.18em] uppercase px-6 py-3.5 hover:bg-brand-200 transition-colors font-medium disabled:opacity-70"
            >
              {loading ? "..." : "Notify Me"}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-4"
          >
            <p className="text-brand-300 text-sm tracking-wide">
              ✓ You're on the list! We'll notify you soon.
            </p>
          </motion.div>
        )}

        <p className="text-[9px] text-brand-700 tracking-wide mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </div>
  );
}
