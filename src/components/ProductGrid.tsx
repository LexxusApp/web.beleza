import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";

const sections = [
  { id: "novidades", title: "Novidades", filter: () => true },
  {
    id: "maquiagem",
    title: "Maquiagem",
    filter: (p: (typeof products)[0]) => p.category === "Maquiagem",
  },
  {
    id: "skincare",
    title: "Skincare",
    filter: (p: (typeof products)[0]) => p.category === "Skincare",
  },
  {
    id: "perfumaria",
    title: "Perfumaria",
    filter: (p: (typeof products)[0]) => p.category === "Perfumaria",
  },
];

export function ProductGrid() {
  return (
    <>
      {sections.map((section) => {
        const items = products.filter(section.filter).slice(0, 4);
        if (items.length === 0) return null;

        return (
          <section key={section.id} id={section.id} className="scroll-mt-24 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
                  {section.title}
                </h2>
                <span className="hidden text-xs uppercase tracking-widest text-ink/40 sm:block">
                  {items.length} produtos
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
