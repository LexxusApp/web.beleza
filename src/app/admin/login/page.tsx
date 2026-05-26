"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Falha ao autenticar.");
      setLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      setError("Esta conta não tem permissão de administrador.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="font-display text-3xl tracking-[0.2em] text-ink">LUMIÈRE</p>
          <p className="mt-2 text-xs uppercase tracking-widest text-ink/50">
            Painel administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              E-mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 w-full rounded-full border border-ink/15 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              Senha
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-full border border-ink/15 bg-cream px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-full bg-ink text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
