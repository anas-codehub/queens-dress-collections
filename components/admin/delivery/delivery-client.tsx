"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DELIVERY_ZONES } from "@/lib/districts";
import { Truck, Check } from "lucide-react";

type Props = {
  chargeMap: Record<string, number>;
};

export default function DeliveryClient({ chargeMap }: Props) {
  const [charges, setCharges] = useState({
    dhaka: chargeMap.dhaka ?? 60,
    subDhaka: chargeMap.subDhaka ?? 100,
    outsideDhaka: chargeMap.outsideDhaka ?? 120,
  });
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await Promise.all(
        Object.entries(charges).map(([zone, charge]) =>
          fetch("/api/delivery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              zone,
              label: DELIVERY_ZONES[zone as keyof typeof DELIVERY_ZONES].label,
              charge,
            }),
          }),
        ),
      );
      toast.success("Delivery charges saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {/* Zone Cards */}
      {Object.entries(DELIVERY_ZONES).map(([zone, data]) => (
        <div key={zone} className="bg-white border border-brand-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 flex items-center justify-center">
                <Truck size={18} strokeWidth={1.5} className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-brand-900 font-medium tracking-wide">
                  {data.label}
                </p>
                <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                  {data.districts.length} district
                  {data.districts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Charge Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-500 tracking-wide">৳</span>
              <input
                type="number"
                value={charges[zone as keyof typeof charges]}
                onChange={(e) =>
                  setCharges((c) => ({
                    ...c,
                    [zone]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-24 bg-brand-50 border border-brand-300 px-3 py-2 text-sm text-brand-900 outline-none focus:border-brand-700 transition-colors text-right"
                min={0}
              />
            </div>
          </div>

          {/* Districts list */}
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-brand-100">
            {data.districts.map((district) => (
              <span
                key={district}
                className="text-[9px] bg-brand-100 text-brand-600 px-2 py-1 tracking-wide"
              >
                {district}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="self-start flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 transition-colors disabled:opacity-70"
      >
        <Check size={14} strokeWidth={2} />
        {loading ? "Saving..." : "Save Delivery Charges"}
      </button>

      {/* Info */}
      <div className="bg-brand-100 border border-brand-200 p-4">
        <p className="text-[10px] text-brand-600 tracking-wide leading-relaxed">
          <strong>How it works:</strong> When a customer selects their district
          at checkout, the delivery charge is automatically calculated based on
          the zone. Dhaka district gets the Dhaka rate, surrounding districts
          get Sub Dhaka rate, and all other districts get the Outside Dhaka
          rate.
        </p>
      </div>
    </div>
  );
}
