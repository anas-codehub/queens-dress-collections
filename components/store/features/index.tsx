import { Truck, RefreshCw, Lock, Headphones, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Delivery within 48 hours",
  },

  {
    icon: Lock,
    title: "Cash On Delivery",
    desc: "Pay only after confirming the product",
  },
  {
    icon: BadgeCheck,
    title: "Authentic Products",
    desc: "100% genuine and trusted quality",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Always here for you",
  },
];

export default function Features() {
  return (
    <section className="border-t border-b border-brand-300">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center text-center py-8 px-4 ${
                i !== features.length - 1 ? "border-r border-brand-300" : ""
              }`}
            >
              <f.icon
                size={20}
                strokeWidth={1.5}
                className="text-brand-500 mb-3"
              />
              <p className="text-[11px] text-brand-800 tracking-[0.12em] uppercase font-medium mb-1">
                {f.title}
              </p>
              <p className="text-[10px] text-brand-500 tracking-wide">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
