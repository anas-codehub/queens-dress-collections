"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { User, Package, Heart, LogOut, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      }));
    }
  }, [session]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      await update({ name: form.name });
      toast.success("Profile updated!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      toast.success("Password updated!");
      setForm((f) => ({
        ...f,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-200">
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          Account
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-brand-900">
            Welcome, {session?.user?.name?.split(" ")[0] ?? "Queen"} 👑
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-[10px] text-brand-400 hover:text-red-500 tracking-[0.12em] uppercase transition-colors"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-brand-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.12em] uppercase transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-brand-900 text-brand-900"
                : "border-transparent text-brand-400 hover:text-brand-700"
            }`}
          >
            <tab.icon size={13} strokeWidth={1.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Update Name */}
          <div className="bg-white border border-brand-200 p-6">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Personal Information
            </h2>
            <form
              onSubmit={handleProfileUpdate}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full bg-brand-100 border border-brand-200 px-4 py-3 text-xs text-brand-400 tracking-wide cursor-not-allowed"
                />
                <p className="text-[10px] text-brand-400 tracking-wide mt-1">
                  Email cannot be changed
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-3.5 hover:bg-brand-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading && (
                  <Loader2
                    size={13}
                    strokeWidth={1.5}
                    className="animate-spin"
                  />
                )}
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-brand-200 p-6">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Change Password
            </h2>
            <form
              onSubmit={handlePasswordUpdate}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                  }
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {/* Password match indicator */}
              {form.newPassword && form.confirmPassword && (
                <p
                  className={`text-[10px] tracking-wide ${
                    form.newPassword === form.confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {form.newPassword === form.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-3.5 hover:bg-brand-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading && (
                  <Loader2
                    size={13}
                    strokeWidth={1.5}
                    className="animate-spin"
                  />
                )}
                Update Password
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Link
              href="/account/orders"
              className="flex items-center gap-4 p-5 bg-white border border-brand-200 hover:border-brand-500 transition-colors group"
            >
              <Package
                size={20}
                strokeWidth={1.5}
                className="text-brand-400 group-hover:text-brand-700 transition-colors"
              />
              <div>
                <p className="text-xs text-brand-800 font-medium tracking-wide">
                  My Orders
                </p>
                <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                  View order history
                </p>
              </div>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-4 p-5 bg-white border border-brand-200 hover:border-brand-500 transition-colors group"
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                className="text-brand-400 group-hover:text-brand-700 transition-colors"
              />
              <div>
                <p className="text-xs text-brand-800 font-medium tracking-wide">
                  My Wishlist
                </p>
                <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                  View saved items
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors mb-6"
          >
            View All Orders →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
