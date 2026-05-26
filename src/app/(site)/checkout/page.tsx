import Link from "next/link";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <h1 className="font-display mt-4 text-3xl tracking-wide sm:text-4xl">
          Finalizar compra
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Preencha seus dados para que possamos preparar o seu pedido.
        </p>

        <div className="mt-8">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
