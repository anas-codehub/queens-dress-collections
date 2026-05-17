import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] text-brand-400 tracking-[0.3em] uppercase mb-4">
        404 — Page Not Found
      </p>
      <h1 className="font-serif text-6xl lg:text-8xl text-brand-900 mb-4">
        Oh dear
      </h1>
      <p className="text-xs text-brand-500 tracking-wide leading-relaxed max-w-sm mb-10">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back to the collection.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 transition-colors"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Back to Home
      </Link>
    </div>
  );
}
