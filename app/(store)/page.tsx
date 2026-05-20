import { db } from "@/lib/db";
import Hero from "@/components/store/hero";
import MarqueeStrip from "@/components/store/hero/marquee";
import Categories from "@/components/store/categories";
import NewArrivals from "@/components/store/product/new-arrivals";
import PromoBanner from "@/components/store/promo-banner";
import BestSellers from "@/components/store/product/best-sellers";
import Features from "@/components/store/features";
import Newsletter from "@/components/store/newsletter";
import { Metadata } from "next";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Queens Dress Collection — Timeless Women's Fashion",
  description:
    "Shop the latest women's dresses, evening gowns, and co-ord sets. Free delivery on orders over ৳3,000. New arrivals every week.",
  openGraph: {
    title: "Queens Dress Collection — Timeless Women's Fashion",
    description:
      "Shop the latest women's dresses, evening gowns, and co-ord sets.",
    url: "/",
  },
};

async function getSettings() {
  const settings = await db.siteSettings.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });
  return map;
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <Hero settings={settings} />
      <MarqueeStrip settings={settings} />
      <Categories />
      <NewArrivals />
      <PromoBanner settings={settings} />
      <BestSellers />
      <Features />
      <Newsletter />
    </>
  );
}
