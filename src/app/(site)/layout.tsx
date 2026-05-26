import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <CartDrawer />
    </CartProvider>
  );
}
