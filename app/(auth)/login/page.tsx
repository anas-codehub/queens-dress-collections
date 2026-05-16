"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }
    toast.success("Welcome back!");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-brand-50 flex">
      {/* LEFT — Branding */}
      <div className="hidden lg:flex w-1/2 bg-brand-200 flex-col items-center justify-center p-16 relative">
        <div className="absolute inset-0 bg-brand-900 opacity-5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <p className="text-[10px] text-brand-500 tracking-[0.3em] uppercase mb-6">
            Welcome Back
          </p>
          <h1 className="font-serif text-5xl text-brand-900 mb-4 leading-tight">
            Queens Dress
            <br />
            <em className="italic">Collection</em>
          </h1>
          <p className="text-xs text-brand-600 tracking-wide leading-relaxed max-w-xs">
            Sign in to access your account, track orders, and explore exclusive
            collections.
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
            Sign In
          </p>
          <h2 className="font-serif text-3xl text-brand-900 mb-8">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-100 border border-brand-300 px-4 py-3.5 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-brand-500 hover:text-brand-900 underline tracking-wide transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-100 border border-brand-300 px-4 py-3.5 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide pr-12"
                  placeholder="Your password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-brand-300" />
            <span className="text-[10px] text-brand-400 tracking-wide">or</span>
            <div className="flex-1 h-px bg-brand-300" />
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-brand-500 tracking-wide">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-brand-900 underline hover:text-brand-600 transition-colors"
            >
              Create one
            </Link>
          </p>

          {/* Back to store */}
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
