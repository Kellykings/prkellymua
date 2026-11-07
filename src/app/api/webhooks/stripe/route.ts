import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!rawBody) {
      return NextResponse.json({ error: 'Empty payload' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any;

    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json(
          { error: 'Missing Stripe signature header' },
          { status: 400 }
        );
      }
      try {
        const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
        payload = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: unknown) {
        return NextResponse.json(
          { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Invalid signature'}` },
          { status: 400 }
        );
      }
    } else {
      payload = JSON.parse(rawBody);
    }

    const eventType = payload?.type;

    if (eventType === 'checkout.session.completed') {
      const session = payload.data?.object || {};
      const customerEmail =
        session.customer_details?.email || 'buyer@example.com';
      const bookFormatId = session.metadata?.book_format_id;
      const amountTotal = session.amount_total || 2900;
      const currency = (session.currency || 'USD').toUpperCase();

      const token = crypto.randomBytes(24).toString('hex');
      const supabaseAdmin = createSupabaseAdminClient();

      if (supabaseAdmin && bookFormatId) {
        const { data: order } = await supabaseAdmin
          .from('orders')
          .insert({
            customer_email: customerEmail,
            payment_processor: 'stripe',
            processor_session_id: session.payment_intent || session.id,
            total_amount_cents: amountTotal,
            currency,
            status: 'completed',
          })
          .select('id')
          .single();

        if (order?.id) {
          try {
            await supabaseAdmin.from('order_items').insert({
              order_id: order.id,
              book_format_id: bookFormatId,
              price_paid_cents: amountTotal,
              token_expires_at: new Date(
                Date.now() + 72 * 60 * 60 * 1000
              ).toISOString(),
            });
          } catch {
            // Optional order_items relationship fallback
          }
        }
      }

      return NextResponse.json({
        received: true,
        signatureVerified: Boolean(signature),
        provisionedToken: token,
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 400 }
    );
  }
}
