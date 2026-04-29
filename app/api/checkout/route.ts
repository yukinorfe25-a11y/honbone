import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

type CheckoutItem = { sku: string; qty: number };

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    const stripe = new Stripe(stripeKey);

    const { items } = (await req.json()) as { items: CheckoutItem[] };
    if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const skus = items.map((i) => i.sku);
    const { data: products, error } = await supabase
      .from('products')
      .select('sku, name, price, stock, image_url, status')
      .in('sku', skus);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const bySku = new Map(products?.map((p) => [p.sku, p]) ?? []);
    let subtotal = 0;
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const it of items) {
      const p = bySku.get(it.sku);
      if (!p || p.status !== 'active') {
        return NextResponse.json({ error: `Unavailable: ${it.sku}` }, { status: 400 });
      }
      if (p.stock < it.qty) {
        return NextResponse.json({ error: `Out of stock: ${p.name}` }, { status: 400 });
      }
      subtotal += p.price * it.qty;
      line_items.push({
        quantity: it.qty,
        price_data: {
          currency: 'jpy',
          unit_amount: p.price,
          product_data: {
            name: p.name,
            metadata: { sku: p.sku },
            ...(p.image_url
              ? { images: [new URL(p.image_url, req.nextUrl.origin).toString()] }
              : {}),
          },
        },
      });
    }

    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['JP'] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        subtotal >= 5000
          ? {
              shipping_rate_data: {
                display_name: '送料無料',
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency: 'jpy' },
              },
            }
          : {
              shipping_rate_data: {
                display_name: '国内配送',
                type: 'fixed_amount',
                fixed_amount: { amount: 800, currency: 'jpy' },
              },
            },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        items_json: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('checkout error', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
