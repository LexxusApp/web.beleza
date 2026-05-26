import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  product_id: string;
  brand: string;
  name: string;
  unit_price: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: CheckoutItem[] = body.items ?? [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio." },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum, i) => sum + i.unit_price * i.quantity,
      0
    );

    const admin = createSupabaseAdminClient();

    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        shipping_address: body.shipping_address,
        notes: body.notes,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: orderErr?.message || "Falha ao criar pedido." },
        { status: 500 }
      );
    }

    const { error: itemsErr } = await admin.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        brand: i.brand,
        name: i.name,
        unit_price: i.unit_price,
        quantity: i.quantity,
      }))
    );

    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: order.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro inesperado" },
      { status: 500 }
    );
  }
}
