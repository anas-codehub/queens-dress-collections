import ProductCard from "./product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Linen Wrap Dress",
    slug: "linen-wrap-dress",
    price: 7200,
    comparePrice: undefined,
    image: "",
    category: "Casual",
    isNew: true,
    isSale: false,
  },
  {
    id: "2",
    name: "Satin Midi Dress",
    slug: "satin-midi-dress",
    price: 5400,
    comparePrice: 8200,
    image: "",
    category: "Evening",
    isNew: false,
    isSale: true,
  },
  {
    id: "3",
    name: "Floral Maxi Dress",
    slug: "floral-maxi-dress",
    price: 6800,
    comparePrice: undefined,
    image: "",
    category: "Summer",
    isNew: true,
    isSale: false,
  },
  {
    id: "4",
    name: "Cream Blazer Dress",
    slug: "cream-blazer-dress",
    price: 9500,
    comparePrice: undefined,
    image: "",
    category: "Office",
    isNew: true,
    isSale: false,
  },
];

export default function NewArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Just In
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-900">
            New Arrivals
          </h2>
        </div>
        <Link
          href="/new-arrivals"
          className="hidden sm:flex items-center gap-2 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors group"
        >
          View All
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/new-arrivals"
          className="inline-flex items-center gap-2 text-[11px] text-brand-600 tracking-[0.12em] uppercase border-b border-brand-400 pb-0.5"
        >
          View All
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
