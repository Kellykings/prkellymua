import { NextResponse } from 'next/server';
import type {
  PrintDeliveryOrder,
  OrderFulfillmentStatus,
  LocalPaymentMethod,
} from '@/types/domain';
import {
  getCustomEntityItems,
  addCustomEntityItem,
  updateCustomEntityItem,
} from '@/lib/data/custom-content-store';
import { verifyAdminRequest } from '@/lib/auth/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { OFFICIAL_PAYMENT_CONFIG } from '@/lib/data/payment-config';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      bookId,
      bookTitle,
      bookSlug,
      format,
      formatSku,
      quantity = 1,
      unitPriceCents = 10700,
      unitPriceXaf = 73955,
      customerName,
      customerEmail,
      customerPhone,
      deliveryCity,
      deliveryAddress,
      deliveryNotes,
      paymentMethod = 'momo',
      paymentReference,
    } = body;

    // Strict validation
    if (!bookTitle || !customerName || customerName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Valid customer name is required.' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid customer email is required.' },
        { status: 400 }
      );
    }

    if (!customerPhone || customerPhone.trim().length < 8) {
      return NextResponse.json(
        { error: 'A valid telephone / WhatsApp number is required for delivery logistics.' },
        { status: 400 }
      );
    }

    if (!deliveryCity || deliveryCity.trim().length < 2) {
      return NextResponse.json(
        { error: 'Delivery city is required.' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || deliveryAddress.trim().length < 3) {
      return NextResponse.json(
        { error: 'Physical delivery address or landmark is required.' },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Math.min(20, Number(quantity) || 1));
    const totalXaf = (Number(unitPriceXaf) || 73955) * qty;

    const validMethods: LocalPaymentMethod[] = ['momo', 'orange_money', 'cash_delivery', 'card'];
    const chosenPaymentMethod: LocalPaymentMethod = validMethods.includes(paymentMethod)
      ? (paymentMethod as LocalPaymentMethod)
      : 'momo';

    let defaultRef = 'PENDING_MOMO_VERIFICATION';
    if (chosenPaymentMethod === 'orange_money') {
      defaultRef = 'PENDING_OM_VERIFICATION';
    } else if (chosenPaymentMethod === 'cash_delivery') {
      defaultRef = 'CASH_ON_DELIVERY';
    }

    const orderNumber = `ORD-KMK-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const newOrder: PrintDeliveryOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      order_number: orderNumber,
      book_id: bookId || 'book-credible-signature-paul-biya',
      book_title: bookTitle,
      book_slug: bookSlug || 'paul-biya-the-art-of-the-credible-signature',
      format: format || 'physical_paperback',
      format_sku: formatSku || 'KMK-BIYA-SIG-PB',
      quantity: qty,
      unit_price_cents: Number(unitPriceCents) || 10700,
      unit_price_xaf: Number(unitPriceXaf) || 73955,
      total_price_xaf: totalXaf,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim().toLowerCase(),
      customer_phone: customerPhone.trim(),
      delivery_city: deliveryCity.trim(),
      delivery_address: deliveryAddress.trim(),
      delivery_notes: deliveryNotes ? String(deliveryNotes).trim() : undefined,
      payment_method: chosenPaymentMethod,
      payment_reference: paymentReference ? String(paymentReference).trim() : defaultRef,
      status: 'pending_verification',
      created_at: new Date().toISOString(),
    };

    // 1. Dual-write to Supabase if configured
    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('print_delivery_orders').insert({
          id: newOrder.id,
          order_number: newOrder.order_number,
          book_id: newOrder.book_id,
          book_title: newOrder.book_title,
          book_slug: newOrder.book_slug,
          format: newOrder.format,
          format_sku: newOrder.format_sku,
          quantity: newOrder.quantity,
          unit_price_cents: newOrder.unit_price_cents,
          unit_price_xaf: newOrder.unit_price_xaf,
          total_price_xaf: newOrder.total_price_xaf,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone,
          delivery_city: newOrder.delivery_city,
          delivery_address: newOrder.delivery_address,
          delivery_notes: newOrder.delivery_notes,
          payment_method: newOrder.payment_method,
          payment_reference: newOrder.payment_reference,
          status: newOrder.status,
          created_at: newOrder.created_at,
          updated_at: newOrder.created_at,
        });
      } catch (sbErr) {
        console.warn('Supabase print order dual-write skipped:', sbErr);
      }
    }

    // 2. Save to atomic local store
    addCustomEntityItem('orders', newOrder);

    const paymentInstructions = chosenPaymentMethod === 'momo'
      ? {
          provider: OFFICIAL_PAYMENT_CONFIG.momo.provider,
          official_number: OFFICIAL_PAYMENT_CONFIG.momo.number,
          recipient: OFFICIAL_PAYMENT_CONFIG.momo.recipientName.en,
          ussd_code: OFFICIAL_PAYMENT_CONFIG.momo.ussdCode,
          amount_xaf: totalXaf,
        }
      : chosenPaymentMethod === 'orange_money'
      ? {
          provider: OFFICIAL_PAYMENT_CONFIG.orange_money.provider,
          official_number: OFFICIAL_PAYMENT_CONFIG.orange_money.number,
          recipient: OFFICIAL_PAYMENT_CONFIG.orange_money.recipientName.en,
          ussd_code: OFFICIAL_PAYMENT_CONFIG.orange_money.ussdCode,
          amount_xaf: totalXaf,
        }
      : null;

    return NextResponse.json({
      ok: true,
      order: newOrder,
      payment_instructions: paymentInstructions,
      message: 'Print delivery order successfully received and dispatched to Admin Studio.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to process print order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized administrative session' }, { status: 401 });
    }

    let orders: PrintDeliveryOrder[] = [];
    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('print_delivery_orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          orders = data as PrintDeliveryOrder[];
        }
      } catch {
        // Fallback to local store
      }
    }

    if (orders.length === 0) {
      orders = getCustomEntityItems<PrintDeliveryOrder>('orders');
    }

    return NextResponse.json({ ok: true, orders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve orders';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized administrative session' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updates: Partial<PrintDeliveryOrder> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status as OrderFulfillmentStatus;
    }

    if (typeof admin_notes === 'string') {
      updates.admin_notes = admin_notes.trim();
    }

    // 1. Sync update to Supabase if configured
    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from('print_delivery_orders')
          .update(updates)
          .eq('id', id);
      } catch (sbErr) {
        console.warn('Supabase print order update skipped:', sbErr);
      }
    }

    // 2. Update atomic local store
    const updated = updateCustomEntityItem<PrintDeliveryOrder>('orders', id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update order status';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
