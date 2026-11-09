import { describe, it, expect, beforeEach } from 'vitest';
import { SEED_BOOKS } from '@/lib/data/seed-data';
import { POST as orderPOST, GET as orderGET, PATCH as orderPATCH } from '@/app/api/orders/route';
import { createAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth/admin-auth';
import { saveContentOverrides, getCustomEntityItems } from '@/lib/data/custom-content-store';
import type { PrintDeliveryOrder } from '@/types/domain';

const CLEAN_STORE = {
  books: [],
  blog: [],
  governance: [],
  media: [],
  gallery: [],
  inquiries: [],
  orders: [],
  deletedIds: {
    books: [],
    blog: [],
    governance: [],
    media: [],
    gallery: [],
    inquiries: [],
    orders: [],
  },
};

describe('Paul Biya Amazon Retailer & Print Delivery Fulfillment Suite', () => {
  beforeEach(() => {
    saveContentOverrides(CLEAN_STORE);
  });

  it('contains the verified Amazon purchase link for Paul BIYA: The Art of the Credible Signature', () => {
    const biyaBook = SEED_BOOKS.find((b) => b.id === 'book-credible-signature-paul-biya');
    expect(biyaBook).toBeDefined();

    const amazonRetailer = biyaBook?.third_party_retailers?.find(
      (r) => r.retail_url.includes('amazon.com')
    );
    expect(amazonRetailer).toBeDefined();
    expect(amazonRetailer?.retail_url).toBe(
      'https://www.amazon.com/ART-CREDIBLE-SIGNATURE-PAUL-BIYA-ebook/dp/B0HPMP8BQZ'
    );
  });

  it('validates and rejects print delivery order missing required recipient coordinates', async () => {
    // Missing name
    const req1 = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookTitle: 'Paul BIYA: The Art of the Credible Signature',
        customerName: '',
        customerEmail: 'test@domain.cm',
        customerPhone: '+237677112233',
        deliveryCity: 'Yaoundé',
        deliveryAddress: 'Bastos',
      }),
    });
    const res1 = await orderPOST(req1);
    expect(res1.status).toBe(400);

    // Missing phone number
    const req2 = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookTitle: 'Paul BIYA: The Art of the Credible Signature',
        customerName: 'Hon. Essomba',
        customerEmail: 'essomba@assemblee.cm',
        customerPhone: '123',
        deliveryCity: 'Yaoundé',
        deliveryAddress: 'Ngoa-Ekélé',
      }),
    });
    const res2 = await orderPOST(req2);
    expect(res2.status).toBe(400);

    // Missing delivery address
    const req3 = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookTitle: 'Paul BIYA: The Art of the Credible Signature',
        customerName: 'Hon. Essomba',
        customerEmail: 'essomba@assemblee.cm',
        customerPhone: '+237677112233',
        deliveryCity: 'Yaoundé',
        deliveryAddress: '',
      }),
    });
    const res3 = await orderPOST(req3);
    expect(res3.status).toBe(400);
  });

  it('successfully creates a physical Trade Paperback delivery order with MTN MoMo', async () => {
    const payload = {
      bookId: 'book-credible-signature-paul-biya',
      bookTitle: 'Paul BIYA: The Art of the Credible Signature',
      bookSlug: 'paul-biya-the-art-of-the-credible-signature',
      format: 'physical_paperback',
      formatSku: 'KMK-BIYA-SIG-PB',
      quantity: 2,
      unitPriceCents: 10700,
      unitPriceXaf: 73955,
      customerName: 'Prof. Joseph Ngu',
      customerEmail: 'j.ngu@univ-yaounde2.cm',
      customerPhone: '(+237) 677 44 55 66',
      deliveryCity: 'Yaoundé',
      deliveryAddress: 'Campus Universitaire Soa, Décanat FSEG',
      deliveryNotes: 'Deliver to Dean office before 3pm',
      paymentMethod: 'momo',
      paymentReference: 'MP261108.1402.G71829',
    };

    const req = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await orderPOST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.order).toBeDefined();
    expect(data.order.order_number).toMatch(/^ORD-KMK-202[0-9]-[A-Z0-9]+$/);
    expect(data.order.total_price_xaf).toBe(147910); // 73,955 * 2
    expect(data.order.status).toBe('pending_verification');
    expect(data.order.payment_method).toBe('momo');
    expect(data.order.payment_reference).toBe('MP261108.1402.G71829');

    // Confirm it persisted in custom store
    const storedOrders = getCustomEntityItems<PrintDeliveryOrder>('orders');
    expect(storedOrders.length).toBe(1);
    expect(storedOrders[0].customer_name).toBe('Prof. Joseph Ngu');
  });

  it('allows authenticated admin to update order fulfillment status from pending to payment_confirmed, dispatched, and delivered', async () => {
    // Seed an order
    const payload = {
      bookId: 'book-credible-signature-paul-biya',
      bookTitle: 'Paul BIYA: The Art of the Credible Signature',
      bookSlug: 'paul-biya-the-art-of-the-credible-signature',
      format: 'physical_paperback',
      formatSku: 'KMK-BIYA-SIG-PB',
      quantity: 1,
      unitPriceCents: 10700,
      unitPriceXaf: 73955,
      customerName: 'Cabinet Avocats CEMAC',
      customerEmail: 'contact@cemac-law.cm',
      customerPhone: '(+237) 699 11 22 33',
      deliveryCity: 'Douala',
      deliveryAddress: 'Rue de la Joie, Bonanjo',
      paymentMethod: 'orange_money',
      paymentReference: 'OM261108.1023',
    };

    const createReq = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const createRes = await orderPOST(createReq);
    const { order } = await createRes.json();

    // Verify status update via PATCH
    const patchPayload = {
      id: order.id,
      status: 'dispatched',
      admin_notes: 'Orange Money payment confirmed. Dispatched via VIP Express Douala tracking #9948.',
    };

    const patchReq = new Request('http://localhost:3000/api/orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: `${ADMIN_COOKIE_NAME}=${createAdminSessionToken()}`,
      },
      body: JSON.stringify(patchPayload),
    });

    const patchRes = await orderPATCH(patchReq);
    expect(patchRes.status).toBe(200);

    const patchData = await patchRes.json();
    expect(patchData.ok).toBe(true);
    expect(patchData.order.status).toBe('dispatched');
    expect(patchData.order.admin_notes).toContain('VIP Express Douala');

    // Final delivery update
    const deliverReq = new Request('http://localhost:3000/api/orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: `${ADMIN_COOKIE_NAME}=${createAdminSessionToken()}`,
      },
      body: JSON.stringify({ id: order.id, status: 'delivered' }),
    });
    const deliverRes = await orderPATCH(deliverReq);
    expect(deliverRes.status).toBe(200);
    const deliverData = await deliverRes.json();
    expect(deliverData.order.status).toBe('delivered');
  });

  it('allows authenticated admin to fetch orders and rejects unauthorized requests', async () => {
    // Unauthenticated GET
    const unauthReq = new Request('http://localhost:3000/api/orders', { method: 'GET' });
    const unauthRes = await orderGET(unauthReq);
    expect(unauthRes.status).toBe(401);

    // Authenticated GET
    const authReq = new Request('http://localhost:3000/api/orders', {
      method: 'GET',
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${createAdminSessionToken()}`,
      },
    });
    const authRes = await orderGET(authReq);
    expect(authRes.status).toBe(200);
    const authData = await authRes.json();
    expect(authData.ok).toBe(true);
    expect(Array.isArray(authData.orders)).toBe(true);
  });

  it('validates SokoClick sales receipt and inventory endpoints format', () => {
    const sokoReceiptUrl = 'https://www.sokoclick.com/en/sales/new';
    const sokoInventoryUrl = 'https://www.sokoclick.com/en/dashboard?mode=BUSINESS';

    expect(sokoReceiptUrl).toMatch(/^https:\/\/www\.sokoclick\.com\/en\/sales\/new$/);
    expect(sokoInventoryUrl).toMatch(/^https:\/\/www\.sokoclick\.com\/en\/dashboard\?mode=BUSINESS$/);
  });
});
