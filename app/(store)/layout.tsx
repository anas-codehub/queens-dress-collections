import CartDrawer from "@/components/store/cart/cart-drawer";
import FloatingButtons from "@/components/store/floating/floating-buttons";
import Footer from "@/components/store/footer";
import Navbar from "@/components/store/Navbar";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </SessionProvider>
    </>
  );
}
