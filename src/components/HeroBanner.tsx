import Image from "next/image";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden sm:min-h-[90vh]">
      <Image
        src="/products/hero-banner.jpg"
        alt="Coleção de cosméticos de luxo Lumière"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24 lg:px-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-light">
          Coleção Primavera 2026
        </p>
        <h1 className="font-display max-w-xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          Beleza que transcende o ordinário
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
          Descubra as edições limitadas das mais prestigiadas marcas de cosméticos do mundo.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="#novidades"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-widest text-ink transition-transform active:scale-[0.98] hover:bg-gold-light"
          >
            Explorar Novidades
          </Link>
          <Link
            href="#maquiagem"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white/60 px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white/10 active:scale-[0.98]"
          >
            Ver Maquiagem
          </Link>
        </div>
      </div>
    </section>
  );
}
