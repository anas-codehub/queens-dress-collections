"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5"
      >
        <CheckCircle size={64} strokeWidth={1} className="text-green-500" />

        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Order Confirmed
          </p>
          <h1 className="font-serif text-3xl text-brand-900 mb-2">
            Thank you! 🎉
          </h1>
          <p className="text-xs text-brand-500 tracking-wide">
            Your order has been placed successfully.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-brand-100 border border-brand-200 px-8 py-4 w-full">
            <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase mb-1">
              Order Number
            </p>
            <p className="font-mono text-lg text-brand-900 font-medium">
              {orderNumber}
            </p>
            <p className="text-[10px] text-brand-400 tracking-wide mt-1">
              Save this for tracking your order
            </p>
          </div>
        )}

        <div className="bg-brand-50 border border-brand-200 p-4 w-full text-left">
          <p className="text-xs text-brand-700 font-medium tracking-wide mb-2">
            What happens next?
          </p>
          <ul className="flex flex-col gap-2">
            {[
              "Our team will confirm your order shortly",
              "Your order will be packed carefully",
              "Steadfast courier will deliver to your address",
              "Pay cash when your order arrives",
            ].map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[11px] text-brand-500 tracking-wide"
              >
                <span className="text-brand-400 shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/shop"
            className="flex-1 text-center border border-brand-300 text-brand-700 text-[11px] tracking-[0.15em] uppercase py-3.5 hover:border-brand-700 hover:text-brand-900 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/login"
            className="flex-1 text-center bg-brand-900 text-brand-100 text-[11px] tracking-[0.15em] uppercase py-3.5 hover:bg-brand-800 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <p className="text-[10px] text-brand-400 tracking-wide">
          Create an account to track all your orders easily
        </p>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
