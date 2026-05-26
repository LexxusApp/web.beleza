import { HeroBanner } from "@/components/HeroBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { SiteFooter } from "@/components/SiteFooter";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ProductGrid />
      <SiteFooter />
    </>
  );
}
