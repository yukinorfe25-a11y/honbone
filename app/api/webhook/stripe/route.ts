import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !whSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  const stripe = new Stripe(stripeKey);

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const supabase = getSupabaseAdmin();

  // Idempotency: skip if order already exists
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();
  if (existing) return NextResponse.json({ received: true, duplicate: true });

  const items = JSON.parse((session.metadata?.items_json as string) || '[]') as Array<{
    sku: string;
    qty: number;
  }>;
  const skus = items.map((i) => i.sku);
  const { data: products } = await supabase
    .from('products')
    .select('id, sku, name, price, stock')
    .in('sku', skus);
  const bySku = new Map(products?.map((p) => [p.sku, p]) ?? []);

  const subtotal = items.reduce((s, it) => s + (bySku.get(it.sku)?.price || 0) * it.qty, 0);
  const shippingFee = subtotal >= 5000 ? 0 : 800;

  const ship = session.shipping_details?.address;
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      status: 'paid',
      subtotal,
      shipping_fee: shippingFee,
      total: session.amount_total ?? subtotal + shippingFee,
      customer_email: session.customer_details?.email ?? '',
      customer_phone: session.customer_details?.phone ?? null,
      customer_name: session.shipping_details?.name ?? session.customer_details?.name ?? null,
      shipping_postal: ship?.postal_code ?? null,
      shipping_prefecture: ship?.state ?? null,
      shipping_city: ship?.city ?? null,
      shipping_line1: ship?.line1 ?? null,
      shipping_line2: ship?.line2 ?? null,
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (orderErr) {
    console.error('order insert', orderErr);
    return NextResponse.json({ error: orderErr.message }, { status: 500 });
  }

  const itemRows = items.map((it) => {
    const p = bySku.get(it.sku);
    return {
      order_id: order!.id,
      product_id: p?.id ?? null,
      sku: it.sku,
      name: p?.name ?? it.sku,
      price: p?.price ?? 0,
      quantity: it.qty,
    };
  });
  await supabase.from('order_items').insert(itemRows);

  // Decrement stock
  for (const it of items) {
    const p = bySku.get(it.sku);
    if (!p) continue;
    await supabase
      .from('products')
      .update({ stock: Math.max(0, p.stock - it.qty) })
      .eq('id', p.id);
  }

  return NextResponse.json({ received: true });
}
