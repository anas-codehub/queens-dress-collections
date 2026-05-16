import CartDrawer from "@/components/store/cart/cart-drawer";
import Footer from "@/components/store/footer";
import Navbar from "@/components/store/Navbar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
