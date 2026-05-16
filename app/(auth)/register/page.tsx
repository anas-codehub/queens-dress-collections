"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex">
      {/* LEFT — Branding */}
      <div className="hidden lg:flex w-1/2 bg-brand-900 flex-col items-center justify-center p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-[10px] text-brand-500 tracking-[0.3em] uppercase mb-6">
            Join Us
          </p>
          <h1 className="font-serif text-5xl text-brand-100 mb-4 leading-tight">
            Become a
            <br />
            <em className="italic text-brand-400">Queen</em>
          </h1>
          <p className="text-xs text-brand-500 tracking-wide leading-relaxed max-w-xs">
            Create your account to unlock exclusive collections, early access,
            and a seamless shopping experience.
          </p>
        </motion.div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.25em] text-brand-900 uppercase"
            >
              QDC
            </Link>
          </div>

          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Create Account
          </p>
          <h2 className="font-serif text-3xl text-brand-900 mb-8">
            Join the Queens Circle
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-brand-100 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full bg-brand-100 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-brand-100 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full bg-brand-100 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide pr-12"
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700 transition-colors"
                >
                  {showPass ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Confirm Password *
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                className="w-full bg-brand-100 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="Repeat your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-brand-500 tracking-wide mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-900 underline hover:text-brand-600 transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center mt-4">
            <Link
              href="/"
              className="text-[10px] text-brand-400 hover:text-brand-700 tracking-[0.12em] uppercase transition-colors"
            >
              ← Back to Store
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
