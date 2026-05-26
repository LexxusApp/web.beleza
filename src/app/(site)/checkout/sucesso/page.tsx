import Link from "next/link";

type Props = { searchParams: Promise<{ id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 pt-20">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display mt-6 text-3xl tracking-wide">Pedido confirmado</h1>
        <p className="mt-3 text-sm text-ink/60">
          Recebemos seu pedido com sucesso. Em breve entraremos em contato com os detalhes do pagamento e da entrega.
        </p>
        {id && (
          <p className="mt-4 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-widest text-ink/50">
            Número: #{id.slice(0, 8)}
          </p>
        )}
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-8 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Voltar à loja
        </Link>
      </div>
    </main>
  );
}
