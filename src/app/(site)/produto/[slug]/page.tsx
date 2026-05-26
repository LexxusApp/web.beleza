import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTabs } from "@/components/ProductTabs";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import { SiteFooter } from "@/components/SiteFooter";
import { getProductBySlug } from "@/lib/queries";
import { formatPrice, productImageUrl } from "@/lib/supabase/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <div className="min-h-screen bg-cream pt-20">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-blush">
              <ProductImage
                src={productImageUrl(product)}
                alt={product.name}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              {product.category && (
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                  {product.category.name}
                </p>
              )}
              <p className="mt-3 text-sm font-bold tracking-wide">{product.brand}</p>
              <h1 className="font-display mt-2 text-2xl leading-tight text-ink sm:text-3xl">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {product.description}
                </p>
              )}
              <p className="mt-4 text-2xl font-medium">{formatPrice(product.price)}</p>
              {product.stock > 0 ? (
                <p className="mt-1 text-xs uppercase tracking-widest text-ink/40">
                  Em estoque ({product.stock} unidades)
                </p>
              ) : (
                <p className="mt-1 text-xs uppercase tracking-widest text-red-500">
                  Esgotado
                </p>
              )}

              <AddToCartButton product={product} />

              <div className="mt-10">
                <ProductTabs
                  howToUse={product.how_to_use}
                  ingredients={product.ingredients}
                  reviews={product.reviews}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
