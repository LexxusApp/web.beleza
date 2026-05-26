import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const allowed = await isAdmin();
  if (!allowed) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }

  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "E-mail e senha são obrigatórios." },
      { status: 400 }
    );
  }

  const admin = createSupabaseAdminClient();
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr || !created.user) {
    return NextResponse.json(
      { error: createErr?.message || "Falha ao criar usuário." },
      { status: 400 }
    );
  }

  const { error: insertErr } = await admin
    .from("admins")
    .insert({ user_id: created.user.id, email });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
