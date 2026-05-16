"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Plus, X } from "lucide-react";

type Props = { settings: Record<string, string> };

export default function AdminSettingsClient({ settings }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // General
  const [storeName, setStoreName] = useState(
    settings.storeName ?? "Queens Dress Collection",
  );
  const [storeTagline, setStoreTagline] = useState(
    settings.storeTagline ?? "Timeless elegance, crafted exclusively for her.",
  );
  const [storeEmail, setStoreEmail] = useState(settings.storeEmail ?? "");
  const [storePhone, setStorePhone] = useState(settings.storePhone ?? "");

  // Homepage
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText ??
      "Free delivery on orders over ৳3,000 — Use code QUEEN20 for 20% off",
  );
  const [announcementExtra, setAnnouncementExtra] = useState(
    settings.announcementExtra ?? "New Summer 2026 Collection — Shop Now",
  );
  const [heroTag, setHeroTag] = useState(
    settings.heroTag ?? "Summer Collection 2026",
  );
  const [heroHeadline, setHeroHeadline] = useState(
    settings.heroHeadline ?? "Dressed for the woman you are",
  );
  const [heroSubtext, setHeroSubtext] = useState(
    settings.heroSubtext ??
      "Timeless silhouettes and luxurious fabrics, crafted exclusively for her.",
  );
  const [heroCta, setHeroCta] = useState(settings.heroCta ?? "Shop Collection");
  const [heroCtaLink, setHeroCtaLink] = useState(
    settings.heroCtaLink ?? "/shop",
  );
  const [heroCtaSecondary, setHeroCtaSecondary] = useState(
    settings.heroCtaSecondary ?? "View Lookbook",
  );
  const [heroCtaSecLink, setHeroCtaSecLink] = useState(
    settings.heroCtaSecLink ?? "/collections",
  );
  const [promoBannerTag, setPromoBannerTag] = useState(
    settings.promoBannerTag ?? "Limited Time",
  );
  const [promoBannerTitle, setPromoBannerTitle] = useState(
    settings.promoBannerTitle ?? "The Summer Edit",
  );
  const [promoBannerText, setPromoBannerText] = useState(
    settings.promoBannerText ??
      "Up to 40% off selected styles — this week only.",
  );
  const [promoBannerCta, setPromoBannerCta] = useState(
    settings.promoBannerCta ?? "Shop the Sale",
  );
  const [promoBannerLink, setPromoBannerLink] = useState(
    settings.promoBannerLink ?? "/sale",
  );

  // Marquee items
  const [marqueeItems, setMarqueeItems] = useState<string[]>(
    settings.marqueeItems
      ? JSON.parse(settings.marqueeItems)
      : [
          "New Arrivals",
          "Summer 2026",
          "Free Returns",
          "Exclusively For Her",
          "Queens Dress Collection",
        ],
  );
  const [newMarqueeItem, setNewMarqueeItem] = useState("");

  // Shipping
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.freeShippingThreshold ?? "3000",
  );
  const [shippingCost, setShippingCost] = useState(
    settings.shippingCost ?? "120",
  );

  // Social
  const [instagram, setInstagram] = useState(settings.instagram ?? "");
  const [facebook, setFacebook] = useState(settings.facebook ?? "");
  const [tiktok, setTiktok] = useState(settings.tiktok ?? "");

  // Footer
  const [footerTagline, setFooterTagline] = useState(
    settings.footerTagline ?? "Timeless elegance, crafted exclusively for her.",
  );

  async function save(data: Record<string, string>) {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "homepage", label: "Homepage" },
    { id: "marquee", label: "Marquee" },
    { id: "shipping", label: "Shipping" },
    { id: "social", label: "Social" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Tabs */}
      <div className="lg:w-44 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[11px] tracking-[0.12em] uppercase whitespace-nowrap text-left transition-colors ${
              activeTab === tab.id
                ? "bg-brand-900 text-brand-100"
                : "text-brand-500 hover:text-brand-900 hover:bg-brand-200 border border-brand-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl">
        {/* General */}
        {activeTab === "general" && (
          <div className="bg-white border border-brand-200 p-6 flex flex-col gap-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              General Settings
            </h2>
            <Field
              label="Store Name"
              value={storeName}
              onChange={setStoreName}
            />
            <Field
              label="Store Tagline"
              value={storeTagline}
              onChange={setStoreTagline}
            />
            <Field
              label="Store Email"
              value={storeEmail}
              onChange={setStoreEmail}
              type="email"
            />
            <Field
              label="Store Phone"
              value={storePhone}
              onChange={setStorePhone}
            />
            <SaveButton
              loading={loading}
              onClick={() =>
                save({ storeName, storeTagline, storeEmail, storePhone })
              }
            />
          </div>
        )}

        {/* Homepage */}
        {activeTab === "homepage" && (
          <div className="bg-white border border-brand-200 p-6 flex flex-col gap-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              Homepage Content
            </h2>

            <Divider label="Announcement Bar" />
            <Field
              label="Announcement Text 1"
              value={announcementText}
              onChange={setAnnouncementText}
            />
            <Field
              label="Announcement Text 2"
              value={announcementExtra}
              onChange={setAnnouncementExtra}
            />

            <Divider label="Hero Section" />
            <Field label="Hero Tag" value={heroTag} onChange={setHeroTag} />
            <Field
              label="Hero Headline"
              value={heroHeadline}
              onChange={setHeroHeadline}
            />
            <Field
              label="Hero Subtext"
              value={heroSubtext}
              onChange={setHeroSubtext}
              textarea
            />
            <Field
              label="CTA Button Text"
              value={heroCta}
              onChange={setHeroCta}
            />
            <Field
              label="CTA Button Link"
              value={heroCtaLink}
              onChange={setHeroCtaLink}
            />
            <Field
              label="Secondary CTA Text"
              value={heroCtaSecondary}
              onChange={setHeroCtaSecondary}
            />
            <Field
              label="Secondary CTA Link"
              value={heroCtaSecLink}
              onChange={setHeroCtaSecLink}
            />

            <Divider label="Promo Banner" />
            <Field
              label="Promo Tag"
              value={promoBannerTag}
              onChange={setPromoBannerTag}
            />
            <Field
              label="Promo Title"
              value={promoBannerTitle}
              onChange={setPromoBannerTitle}
            />
            <Field
              label="Promo Text"
              value={promoBannerText}
              onChange={setPromoBannerText}
              textarea
            />
            <Field
              label="Promo CTA Text"
              value={promoBannerCta}
              onChange={setPromoBannerCta}
            />
            <Field
              label="Promo CTA Link"
              value={promoBannerLink}
              onChange={setPromoBannerLink}
            />

            <SaveButton
              loading={loading}
              onClick={() =>
                save({
                  announcementText,
                  announcementExtra,
                  heroTag,
                  heroHeadline,
                  heroSubtext,
                  heroCta,
                  heroCtaLink,
                  heroCtaSecondary,
                  heroCtaSecLink,
                  promoBannerTag,
                  promoBannerTitle,
                  promoBannerText,
                  promoBannerCta,
                  promoBannerLink,
                })
              }
            />
          </div>
        )}

        {/* Marquee */}
        {activeTab === "marquee" && (
          <div className="bg-white border border-brand-200 p-6 flex flex-col gap-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              Marquee Strip Items
            </h2>
            <p className="text-[10px] text-brand-400 tracking-wide">
              These scroll across the marquee strip below the hero section.
            </p>

            <div className="flex flex-col gap-2">
              {marqueeItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...marqueeItems];
                      updated[i] = e.target.value;
                      setMarqueeItems(updated);
                    }}
                    className="flex-1 bg-brand-50 border border-brand-300 px-3 py-2 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  />
                  <button
                    onClick={() =>
                      setMarqueeItems((m) => m.filter((_, idx) => idx !== i))
                    }
                    className="text-brand-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMarqueeItem}
                onChange={(e) => setNewMarqueeItem(e.target.value)}
                className="flex-1 bg-brand-50 border border-brand-300 px-3 py-2 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="Add new item..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newMarqueeItem.trim()) {
                    setMarqueeItems((m) => [...m, newMarqueeItem.trim()]);
                    setNewMarqueeItem("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newMarqueeItem.trim()) {
                    setMarqueeItems((m) => [...m, newMarqueeItem.trim()]);
                    setNewMarqueeItem("");
                  }
                }}
                className="bg-brand-900 text-brand-100 text-[10px] tracking-[0.12em] uppercase px-4 hover:bg-brand-800 transition-colors flex items-center gap-1.5"
              >
                <Plus size={12} strokeWidth={1.5} />
                Add
              </button>
            </div>

            <SaveButton
              loading={loading}
              onClick={() =>
                save({ marqueeItems: JSON.stringify(marqueeItems) })
              }
            />
          </div>
        )}

        {/* Shipping */}
        {activeTab === "shipping" && (
          <div className="bg-white border border-brand-200 p-6 flex flex-col gap-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              Shipping Settings
            </h2>
            <Field
              label="Free Shipping Threshold (৳)"
              value={freeShippingThreshold}
              onChange={setFreeShippingThreshold}
              type="number"
            />
            <Field
              label="Standard Shipping Cost (৳)"
              value={shippingCost}
              onChange={setShippingCost}
              type="number"
            />
            <SaveButton
              loading={loading}
              onClick={() => save({ freeShippingThreshold, shippingCost })}
            />
          </div>
        )}

        {/* Social */}
        {activeTab === "social" && (
          <div className="bg-white border border-brand-200 p-6 flex flex-col gap-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              Social Media Links
            </h2>
            <Field
              label="Instagram URL"
              value={instagram}
              onChange={setInstagram}
              placeholder="https://instagram.com/yourstore"
            />
            <Field
              label="Facebook URL"
              value={facebook}
              onChange={setFacebook}
              placeholder="https://facebook.com/yourstore"
            />
            <Field
              label="TikTok URL"
              value={tiktok}
              onChange={setTiktok}
              placeholder="https://tiktok.com/@yourstore"
            />
            <SaveButton
              loading={loading}
              onClick={() => save({ instagram, facebook, tiktok })}
            />
          </div>
        )}

        {/* Footer */}
        {activeTab === "footer" && (
          <div className="bg-white border border-brand-200 p-6 flex flex-col gap-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              Footer Settings
            </h2>
            <Field
              label="Footer Tagline"
              value={footerTagline}
              onChange={setFooterTagline}
              textarea
            />
            <SaveButton
              loading={loading}
              onClick={() => save({ footerTagline })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Field Component ─────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  const baseClass =
    "w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide";

  return (
    <div>
      <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${baseClass} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-brand-200" />
      <span className="text-[9px] text-brand-400 tracking-[0.2em] uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-brand-200" />
    </div>
  );
}

function SaveButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="self-start flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.15em] uppercase px-6 py-3 hover:bg-brand-800 transition-colors disabled:opacity-70"
    >
      <Check size={13} strokeWidth={2} />
      {loading ? "Saving..." : "Save Changes"}
    </button>
  );
}
