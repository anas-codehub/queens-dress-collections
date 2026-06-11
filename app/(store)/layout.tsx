import Footer from "@/components/store/footer";
import CartDrawer from "@/components/store/cart/cart-drawer";
import FloatingButtons from "@/components/store/floating/floating-buttons";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import MetaPixel from "@/components/shared/meta-pixel";
import { Suspense } from "react";
import Navbar from "@/components/store/Navbar";
import GoogleAnalytics from "@/components/shared/google-analytics";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Suspense>
        <MetaPixel />
        <GoogleAnalytics />
      </Suspense>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
    </SessionProvider>
  );
}
