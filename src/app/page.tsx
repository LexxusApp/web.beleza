import { HeroBanner } from "@/components/HeroBanner";
import { ProductGrid } from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ProductGrid />
      <footer className="border-t border-ink/10 bg-ink py-12 text-center text-white/60">
        <p className="font-display text-lg tracking-widest text-white">LUMIÈRE</p>
        <p className="mt-2 text-xs uppercase tracking-widest">
          © 2026 — Beleza de luxo, entregue com elegância
        </p>
      </footer>
    </>
  );
}
