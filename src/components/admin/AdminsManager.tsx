"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AdminsManager() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ kind: "err", text: json.error || "Erro ao criar admin." });
        return;
      }
      setMessage({ kind: "ok", text: "Administrador criado com sucesso." });
      setEmail("");
      setPassword("");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleCreate}
      className="space-y-4 rounded-2xl border border-ink/10 bg-white p-5"
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink/60">
        Adicionar administrador
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          className="rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha (mín. 6 caracteres)"
          className="rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm"
        />
      </div>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.kind === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-[48px] w-full rounded-full bg-ink text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {pending ? "Criando..." : "Criar administrador"}
      </button>
    </form>
  );
}
