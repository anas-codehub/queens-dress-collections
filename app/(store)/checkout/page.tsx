"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useDeliveryCharge } from "@/hooks/use-delivery-charge";
import { ALL_DISTRICTS } from "@/lib/districts";
import { trackEvent } from "@/components/shared/meta-pixel";
import { trackGAEvent } from "@/components/shared/google-analytics";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const payment = "COD";

  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const [shipping_info, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    district: "",
    postalCode: "",
  });

  const subtotal = getTotalPrice();
  const { charge: deliveryCharge, zoneLabel } = useDeliveryCharge(
    shipping_info.district,
  );
  const shipping = deliveryCharge;
  const total = subtotal + shipping;

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required = ["name", "phone", "line1", "city", "district"];
    for (const field of required) {
      if (!shipping_info[field as keyof typeof shipping_info]) {
        toast.error(`Please fill in ${field}`);
        return;
      }
    }
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingInfo: shipping_info,
          paymentMethod: payment,
          subtotal,
          shipping,
          total,
          couponCode: coupon || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to place order");
        return;
      }

      clearCart();

      trackGAEvent("purchase", {
        transaction_id: `QDC-${Date.now()}`,
        value: total,
        currency: "BDT",
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      trackEvent("Purchase", {
        value: total,
        currency: "BDT",
        contents: items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
        content_type: "product",
      });
      toast.success("Order placed successfully! 🎉");
      router.push("/account/orders");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-24 text-center">
        <p className="font-serif text-2xl text-brand-700 mb-4">
          Your cart is empty
        </p>
        <Link
          href="/shop"
          className="text-[11px] text-brand-600 tracking-[0.15em] uppercase underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  function DistrictAutocomplete({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function handleInput(val: string) {
      setQuery(val);
      onChange(val);
      if (val.length > 0) {
        const filtered = ALL_DISTRICTS.filter((d) =>
          d.toLowerCase().startsWith(val.toLowerCase()),
        );
        setSuggestions(filtered);
        setOpen(filtered.length > 0);
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    }

    function handleSelect(district: string) {
      setQuery(district);
      onChange(district);
      setOpen(false);
    }

    return (
      <div ref={ref} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
          placeholder="Type or select district"
          autoComplete="off"
        />
        {open && (
          <div className="absolute top-full left-0 right-0 bg-brand-50 border border-brand-300 border-t-0 z-20 max-h-48 overflow-y-auto">
            {suggestions.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleSelect(d)}
                className="w-full text-left px-4 py-2.5 text-xs text-brand-700 hover:bg-brand-200 hover:text-brand-900 transition-colors tracking-wide"
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-300 text-center">
        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.25em] text-brand-900 uppercase"
        >
          QDC
        </Link>
        <p className="text-[10px] text-brand-400 tracking-[0.2em] uppercase mt-1">
          Secure Checkout
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                  i <= step
                    ? "bg-brand-900 text-brand-50"
                    : "bg-brand-200 text-brand-500"
                }`}
              >
                {i < step ? <Check size={14} strokeWidth={2} /> : i + 1}
              </div>
              <span
                className={`text-[10px] tracking-[0.12em] uppercase ${
                  i === step ? "text-brand-900" : "text-brand-400"
                }`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-px mx-2 mb-4 transition-colors ${
                  i < step ? "bg-brand-900" : "bg-brand-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT — Steps */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* STEP 0 — Shipping */}
            {step === 0 && (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleShippingSubmit}
                className="flex flex-col gap-5"
              >
                <h2 className="font-serif text-2xl text-brand-900 mb-2">
                  Shipping Information
                </h2>

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shipping_info.name}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shipping_info,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shipping_info.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shipping_info,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={shipping_info.email}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shipping_info,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={shipping_info.line1}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shipping_info,
                        line1: e.target.value,
                      })
                    }
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                    placeholder="House no, Road no, Area"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={shipping_info.line2}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shipping_info,
                        line2: e.target.value,
                      })
                    }
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                    placeholder="Apartment, floor (optional)"
                  />
                </div>

                {/* City + District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shipping_info.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shipping_info,
                          city: e.target.value,
                        })
                      }
                      className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                      placeholder="Your city"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                      District *
                    </label>
                    <DistrictAutocomplete
                      value={shipping_info.district}
                      onChange={(val) =>
                        setShippingInfo({ ...shipping_info, district: val })
                      }
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={shipping_info.postalCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shipping_info,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                    placeholder="1200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors mt-2"
                >
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {/* STEP 1 — Payment */}
            {step === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5"
              >
                <h2 className="font-serif text-2xl text-brand-900 mb-2">
                  Payment Method
                </h2>

                {/* Payment Options — COD only */}
                <div className="p-4 border border-brand-900 bg-brand-100 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-900 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-900" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-900 font-medium tracking-wide">
                      Cash on Delivery
                    </p>
                    <p className="text-[10px] text-brand-500 tracking-wide mt-0.5">
                      Pay when your order arrives at your door
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 text-[11px] text-brand-600 tracking-[0.15em] uppercase border border-brand-300 py-4 hover:border-brand-700 hover:text-brand-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <h2 className="font-serif text-2xl text-brand-900 mb-2">
                  Review Your Order
                </h2>

                <div className="p-4 bg-brand-100 border border-brand-300">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                      Shipping To
                    </p>
                    <button
                      onClick={() => setStep(0)}
                      className="text-[10px] text-brand-500 hover:text-brand-900 underline tracking-wide transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-brand-800 tracking-wide">
                    {shipping_info.name}
                  </p>
                  <p className="text-xs text-brand-600 tracking-wide">
                    {shipping_info.phone}
                  </p>
                  <p className="text-xs text-brand-600 tracking-wide">
                    {shipping_info.line1}
                    {shipping_info.line2 ? `, ${shipping_info.line2}` : ""}
                  </p>
                  <p className="text-xs text-brand-600 tracking-wide">
                    {shipping_info.city}, {shipping_info.district}
                  </p>
                </div>

                <div className="p-4 bg-brand-100 border border-brand-300">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                      Payment
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[10px] text-brand-500 hover:text-brand-900 underline tracking-wide transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-brand-800 tracking-wide">
                    {payment}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex items-center gap-4 py-3 border-b border-brand-200"
                    >
                      <div className="w-14 h-16 bg-brand-200 flex items-center justify-center shrink-0">
                        <span className="font-serif text-sm text-brand-400">
                          QDC
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-brand-800 font-medium tracking-wide">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                          Qty: {item.quantity}
                          {item.size && ` · Size: ${item.size}`}
                        </p>
                      </div>
                      <p className="text-xs text-brand-900 font-medium">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 text-[11px] text-brand-600 tracking-[0.15em] uppercase border border-brand-300 py-4 hover:border-brand-700 hover:text-brand-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors disabled:opacity-70"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-100 border border-brand-300 p-6 sticky top-24">
            <h2 className="font-serif text-xl text-brand-900 mb-5">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-12 bg-brand-200 flex items-center justify-center shrink-0">
                      <span className="font-serif text-xs text-brand-400">
                        QDC
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-brand-800 tracking-wide leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-brand-400">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-brand-800 font-medium">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="flex gap-0 mb-4">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 bg-brand-50 border border-brand-300 px-3 py-2.5 text-xs text-brand-800 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
              />
              <button
                onClick={() => toast.info("Coupon applied!")}
                className="bg-brand-900 text-brand-100 text-[10px] tracking-[0.12em] uppercase px-4 hover:bg-brand-800 transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-brand-300">
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>
                  Delivery
                  {shipping_info.district && (
                    <span className="ml-1 text-[10px] text-brand-400">
                      ({zoneLabel})
                    </span>
                  )}
                </span>
                <span>
                  {shipping_info.district
                    ? `৳${deliveryCharge.toLocaleString()}`
                    : "Select district"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-brand-900 pt-2 border-t border-brand-300">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
