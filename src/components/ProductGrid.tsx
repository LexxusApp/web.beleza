import { getCategories, getFeaturedProducts, getProductsByCategory } from "@/lib/queries";
import { ProductCard } from "./ProductCard";

export async function ProductGrid() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
  ]);

  const sections: { id: string; title: string; products: typeof featured }[] = [];

  if (featured.length > 0) {
    sections.push({ id: "novidades", title: "Novidades", products: featured });
  }

  for (const cat of categories) {
    const products = await getProductsByCategory(cat.slug, 4);
    if (products.length > 0) {
      sections.push({ id: cat.slug, title: cat.name, products });
    }
  }

  if (sections.length === 0) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm text-ink/50">
          Nenhum produto cadastrado ainda. Acesse o painel admin para começar.
        </p>
      </section>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-24 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
                {section.title}
              </h2>
              <span className="hidden text-xs uppercase tracking-widest text-ink/40 sm:block">
                {section.products.length} produtos
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
