"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";

const options = [
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Pago" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
];

export function OrderStatusForm({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateOrderStatus(id, status);
      router.refresh();
    });
  }

  return (
    <div className="mt-3 space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-xl border border-ink/15 bg-cream px-3 py-3 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={pending || status === currentStatus}
        className="min-h-[44px] w-full rounded-full bg-ink text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Atualizar status"}
      </button>
    </div>
  );
}
