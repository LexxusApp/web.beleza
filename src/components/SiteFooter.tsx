import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink py-12 text-center text-white/60">
      <p className="font-display text-lg tracking-widest text-white">LUMIÈRE</p>
      <p className="mt-2 text-xs uppercase tracking-widest">
        © 2026 — Beleza de luxo, entregue com elegância
      </p>
      <p className="mt-4 text-[10px] uppercase tracking-widest">
        <Link href="/admin" className="text-white/40 hover:text-white">
          Acesso restrito
        </Link>
      </p>
    </footer>
  );
}
