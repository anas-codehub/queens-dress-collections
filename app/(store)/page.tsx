import Categories from "@/components/store/categories";
import Features from "@/components/store/features";
import Hero from "@/components/store/hero";
import MarqueeStrip from "@/components/store/hero/marquee";
import Newsletter from "@/components/store/newsletter";
import BestSellers from "@/components/store/product/best-sellers";
import NewArrivals from "@/components/store/product/new-arrivals";
import PromoBanner from "@/components/store/promo-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Categories />
      <NewArrivals />
      <PromoBanner />
      <BestSellers />
      <Features />
      <Newsletter />
    </>
  );
}
