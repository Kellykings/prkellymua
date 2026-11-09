import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { addCustomEntityItem } from '@/lib/data/custom-content-store';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const VALID_INQUIRY_TYPES = [
  'Academic & Keynote Speaking',
  'Institutional Book Acquisition',
  'Research & Policy Collaboration',
  'Accredited Press & Media',
];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload format.' },
      { status: 400 }
    );
  }

  try {
    // 1. Honeypot check: silently accept bot traffic without persistence
    const honeypot = body.protocol_hp || body.hp || body._gotcha;
    if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Field extraction & trimming
    const rawName =
      body.senderName || body.sender_name || body.name || body.full_name;
    const rawEmail =
      body.senderEmail || body.sender_email || body.email;
    const rawOrg =
      body.organization || body.org || '';
    const rawInquiryType =
      body.inquiryType || body.inquiry_type || 'Academic & Keynote Speaking';
    const rawSubject = body.subject;
    const rawMessage = body.message;

    const senderName = typeof rawName === 'string' ? rawName.trim() : '';
    const senderEmail = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const organization = typeof rawOrg === 'string' ? rawOrg.trim() : null;
    const subject = typeof rawSubject === 'string' ? rawSubject.trim() : '';
    const message = typeof rawMessage === 'string' ? rawMessage.trim() : '';

    // 3. Required fields check
    if (!senderName || !senderEmail || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required protocol inquiry fields (name, email, subject, message).' },
        { status: 400 }
      );
    }

    // 4. Email syntax check
    if (!EMAIL_REGEX.test(senderEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid institutional email address.' },
        { status: 400 }
      );
    }

    // 5. Length limits check
    if (senderName.length > 120) {
      return NextResponse.json(
        { error: 'Sender name exceeds maximum allowed length of 120 characters.' },
        { status: 400 }
      );
    }
    if (senderEmail.length > 120) {
      return NextResponse.json(
        { error: 'Email address exceeds maximum allowed length of 120 characters.' },
        { status: 400 }
      );
    }
    if (organization && organization.length > 150) {
      return NextResponse.json(
        { error: 'Organization name exceeds maximum allowed length of 150 characters.' },
        { status: 400 }
      );
    }
    if (subject.length < 3 || subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be between 3 and 200 characters.' },
        { status: 400 }
      );
    }
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5,000 characters.' },
        { status: 400 }
      );
    }

    // 6. Whitelist inquiry category
    const inquiryType =
      typeof rawInquiryType === 'string' &&
      VALID_INQUIRY_TYPES.includes(rawInquiryType.trim())
        ? rawInquiryType.trim()
        : 'Academic & Keynote Speaking';

    const submissionRecord = {
      id: `inq-${crypto.randomUUID().slice(0, 8)}`,
      sender_name: senderName,
      sender_email: senderEmail,
      organization: organization || null,
      inquiry_type: inquiryType,
      subject,
      message,
      created_at: new Date().toISOString(),
      status: 'received',
    };

    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('contact_submissions').insert(submissionRecord);
      } catch {
        // Fallback to local store
      }
    }

    // Always persist to local content store for instant offline/admin viewability
    addCustomEntityItem('inquiries', submissionRecord);

    return NextResponse.json({
      ok: true,
      timestamp: submissionRecord.created_at,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process inquiry.' },
      { status: 500 }
    );
  }
}
