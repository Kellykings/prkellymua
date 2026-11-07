import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getBookBySlug, getBooks } from '@/lib/data/repository';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookId,
      bookSlug,
      formatId,
      customerEmail,
      locale = 'en',
    } = body as {
      bookId?: string;
      bookSlug?: string;
      formatId?: string;
      customerEmail?: string;
      locale?: string;
    };

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'A valid buyer email address is required.' },
        { status: 400 }
      );
    }

    const book = bookSlug ? await getBookBySlug(bookSlug) : undefined;
    const selectedFormat =
      book?.book_formats.find((f) => f.id === formatId) ||
      book?.book_formats[0];

    const tokenSecret =
      process.env.DOWNLOAD_TOKEN_SECRET || 'kelly-kingsly-default-vault-secret';
    const rawPayload = `${bookId || 'book'}:${formatId || 'fmt'}:${customerEmail}:${Date.now()}`;
    const signedToken = crypto
      .createHmac('sha256', tokenSecret)
      .update(rawPayload)
      .digest('hex')
      .slice(0, 32);

    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin && book && selectedFormat) {
      try {
        const { data: orderData } = await supabaseAdmin
          .from('orders')
          .insert({
            customer_email: customerEmail,
            payment_processor: 'stripe',
            processor_session_id: `pi_sim_${signedToken.slice(0, 12)}`,
            total_amount_cents: selectedFormat.price_cents,
            currency: selectedFormat.currency,
            status: 'completed',
          })
          .select('id')
          .single();

        if (orderData?.id) {
          try {
            await supabaseAdmin.from('order_items').insert({
              order_id: orderData.id,
              book_format_id: selectedFormat.id,
              price_paid_cents: selectedFormat.price_cents,
              token_expires_at: new Date(
                Date.now() + 72 * 60 * 60 * 1000
              ).toISOString(),
            });
          } catch {
            // Optional order_items relationship fallback
          }
        }
      } catch {
        // Non-blocking fallback when tables are not yet migrated
      }
    }

    const redirectUrl = `/${locale}/books/download/${signedToken}?book=${encodeURIComponent(
      bookSlug || 'understanding-capital-markets-bvmac'
    )}&format=${encodeURIComponent(
      selectedFormat?.format || 'digital_pdf'
    )}&email=${encodeURIComponent(customerEmail)}`;

    return NextResponse.json({
      url: redirectUrl,
      token: signedToken,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to initialize book checkout session.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('downloadToken') || 'verified-token';
  const slug =
    searchParams.get('book') || 'understanding-capital-markets-bvmac';

  const books = await getBooks();
  const book = books.find((b) => b.slug === slug) || books[0];

  const documentContent = [
    '====================================================================',
    'PROFESSOR KELLY MUA KINGSLY — DIGITAL FULFILLMENT VAULT EDITION',
    '====================================================================',
    `Title (EN):     ${book.title.en}`,
    `Title (FR):     ${book.title.fr}`,
    `Author:         Professor Kelly Mua Kingsly (PhD, DBA, MPA, CFA)`,
    `ISBN-13:        ${book.isbn}`,
    `Publisher:      ${book.publisher}`,
    `Token ID:       ${token}`,
    `Timestamp:      ${new Date().toISOString()}`,
    '--------------------------------------------------------------------',
    'EXECUTIVE SYNOPSIS:',
    book.synopsis.en,
    '',
    'KEY TAKEAWAYS:',
    ...book.key_takeaways.map((kt, idx) => `${idx + 1}. ${kt.en}`),
    '',
    'SELECTED CHAPTERS:',
    ...book.chapters.map(
      (ch) => `Chapter ${ch.number}: ${ch.title.en} - ${ch.summary.en}`
    ),
    '====================================================================',
  ].join(String.fromCharCode(10));

  return new NextResponse(documentContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${book.slug}-edition.txt"`,
    },
  });
}
