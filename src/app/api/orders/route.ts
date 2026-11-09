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
      payment_method: (paymentMethod as LocalPaymentMethod) || 'momo',
      payment_reference: paymentReference ? String(paymentReference).trim() : 'PENDING_MOMO_VERIFICATION',
      status: paymentMethod === 'cash_delivery' ? 'pending_verification' : 'pending_verification',
      created_at: new Date().toISOString(),
    };

    // Save to atomic local store
    addCustomEntityItem('orders', newOrder);

    return NextResponse.json({
      ok: true,
      order: newOrder,
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

    const orders = getCustomEntityItems<PrintDeliveryOrder>('orders');
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
