import CartDrawer from "@/components/store/cart/cart-drawer";
import FloatingButtons from "@/components/store/floating/floating-buttons";
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
      <FloatingButtons />
    </>
  );
}
