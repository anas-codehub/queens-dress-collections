"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/components/shared/meta-pixel";
import { trackGAEvent } from "@/components/shared/google-analytics";

const steps = ["Shipping", "Review"];

// ─── Delivery Zones ───────────────────────────────────────────────────────────
const DELIVERY_ZONES = [
  {
    id: "dhaka",
    label: "Inside Dhaka",
    charge: 60,
    desc: "Dhaka city area",
  },
  {
    id: "subDhaka",
    label: "Sub Dhaka",
    charge: 120,
    desc: "Gazipur, Narayanganj, Savar, Manikganj, Munshiganj, Narsingdi",
  },
  {
    id: "outsideDhaka",
    label: "Outside Dhaka",
    charge: 180,
    desc: "All other districts across Bangladesh",
  },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = getTotalPrice();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const deliveryCharge =
    DELIVERY_ZONES.find((z) => z.id === selectedZone)?.charge ?? 0;
  const total = subtotal + deliveryCharge;

  const payment = "COD";

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Name validation — only letters (English + Bangla) and spaces
    const nameRegex = /^[\u0980-\u09FF a-zA-Z\s]+$/;
    if (!shippingInfo.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!nameRegex.test(shippingInfo.name.trim())) {
      toast.error("Name can only contain letters — no numbers or symbols");
      return;
    }

    // Phone validation — only digits (English 0-9 or Bangla ০-৯), exactly 11
    const phoneDigitsOnly = shippingInfo.phone
      .replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)))
      .replace(/\D/g, "");

    if (!shippingInfo.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (phoneDigitsOnly.length !== 11) {
      toast.error("Phone number must be exactly 11 digits");
      return;
    }

    if (!shippingInfo.address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!selectedZone) {
      toast.error("Please select your delivery zone");
      return;
    }

    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const zone = DELIVERY_ZONES.find((z) => z.id === selectedZone);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingInfo: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            line1: shippingInfo.address,
            line2: null,
            city: zone?.label ?? "",
            district: zone?.label ?? "",
            postalCode: null,
          },
          paymentMethod: payment,
          subtotal,
          shipping: deliveryCharge,
          total,
          couponCode: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to place order");
        return;
      }

      // Track events
      trackEvent("Purchase", {
        value: total,
        currency: "BDT",
        contents: items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
        content_type: "product",
      });

      trackGAEvent("purchase", {
        transaction_id: data.orderId,
        value: total,
        currency: "BDT",
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      clearCart();
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

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-10">
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

      {/* Steps */}
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
        {/* LEFT */}
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
                  Delivery Information
                </h2>

                {/* Name */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only English letters, Bangla letters and spaces
                      if (
                        /^[\u0980-\u09FF a-zA-Z\s]*$/.test(value) ||
                        value === ""
                      ) {
                        setShippingInfo({ ...shippingInfo, name: value });
                      }
                    }}
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                    placeholder="Your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only English digits and Bangla digits
                      if (/^[0-9০-৯]*$/.test(value) || value === "") {
                        // Limit to 11 characters
                        if (value.length <= 11) {
                          setShippingInfo({ ...shippingInfo, phone: value });
                        }
                      }
                    }}
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                  />
                  <p
                    className={`text-[10px] tracking-wide mt-1 ${
                      shippingInfo.phone.length === 11
                        ? "text-green-600"
                        : "text-brand-400"
                    }`}
                  >
                    {shippingInfo.phone.length}/11 digits
                    {shippingInfo.phone.length === 11 && " ✓"}
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    Full Address *
                  </label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide resize-none"
                    placeholder="House no, Road no, Area, Thana..."
                  />
                </div>

                {/* Delivery Zone */}
                <div>
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-3">
                    Delivery Zone *
                  </label>
                  <div className="flex flex-col gap-3">
                    {DELIVERY_ZONES.map((zone) => (
                      <label
                        key={zone.id}
                        className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                          selectedZone === zone.id
                            ? "border-brand-900 bg-brand-100"
                            : "border-brand-300 hover:border-brand-500"
                        }`}
                      >
                        {/* Custom checkbox */}
                        <div
                          className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            selectedZone === zone.id
                              ? "bg-brand-900 border-brand-900"
                              : "border-brand-400"
                          }`}
                          onClick={() => setSelectedZone(zone.id)}
                        >
                          {selectedZone === zone.id && (
                            <Check
                              size={10}
                              strokeWidth={2.5}
                              className="text-white"
                            />
                          )}
                        </div>

                        <div
                          className="flex-1"
                          onClick={() => setSelectedZone(zone.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-brand-900 font-medium tracking-wide">
                              {zone.label}
                            </p>
                            <p className="text-xs font-medium text-brand-900">
                              ৳{zone.charge}
                            </p>
                          </div>
                          <p className="text-[10px] text-brand-500 tracking-wide">
                            {zone.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors mt-2"
                >
                  Review Order
                </button>
              </motion.form>
            )}

            {/* STEP 1 — Review */}
            {step === 1 && (
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

                {/* Delivery Summary */}
                <div className="p-4 bg-brand-100 border border-brand-300">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                      Delivering To
                    </p>
                    <button
                      onClick={() => setStep(0)}
                      className="text-[10px] text-brand-500 hover:text-brand-900 underline tracking-wide transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-brand-800 font-medium tracking-wide">
                    {shippingInfo.name}
                  </p>
                  <p className="text-xs text-brand-600 tracking-wide mt-1">
                    {shippingInfo.phone}
                  </p>
                  <p className="text-xs text-brand-600 tracking-wide mt-1">
                    {shippingInfo.address}
                  </p>
                  <p className="text-xs text-brand-600 tracking-wide mt-1">
                    {DELIVERY_ZONES.find((z) => z.id === selectedZone)?.label} —
                    ৳{deliveryCharge} delivery
                  </p>
                </div>

                {/* Payment */}
                <div className="p-4 bg-brand-100 border border-brand-300">
                  <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium mb-2">
                    Payment
                  </p>
                  <p className="text-xs text-brand-800 tracking-wide">
                    Cash on Delivery
                  </p>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex items-center gap-4 py-3 border-b border-brand-200"
                    >
                      <div className="w-14 h-16 bg-brand-200 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-serif text-sm text-brand-400">
                            QDC
                          </span>
                        )}
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
                    onClick={() => setStep(0)}
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

            <div className="flex flex-col gap-3 mb-4 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-12 bg-brand-200 shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-xs text-brand-400">
                            QDC
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-brand-800 tracking-wide leading-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-brand-400">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-brand-800 font-medium shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-brand-300">
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>
                  Delivery
                  {selectedZone && (
                    <span className="ml-1 text-[10px] text-brand-400">
                      (
                      {DELIVERY_ZONES.find((z) => z.id === selectedZone)?.label}
                      )
                    </span>
                  )}
                </span>
                <span>
                  {selectedZone
                    ? `৳${deliveryCharge.toLocaleString()}`
                    : "Select zone"}
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
