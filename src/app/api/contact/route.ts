import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { addCustomEntityItem } from '@/lib/data/custom-content-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const senderName =
      body.senderName || body.sender_name || body.name || body.full_name;
    const senderEmail =
      body.senderEmail || body.sender_email || body.email;
    const organization =
      body.organization || body.org || null;
    const inquiryType =
      body.inquiryType || body.inquiry_type || 'Academic & Keynote Speaking';
    const subject = body.subject;
    const message = body.message;

    if (!senderName || !senderEmail || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required protocol inquiry fields (name, email, subject, message).' },
        { status: 400 }
      );
    }

    const submissionRecord = {
      id: `inq-${crypto.randomUUID().slice(0, 8)}`,
      sender_name: senderName,
      sender_email: senderEmail,
      organization: organization || null,
      inquiry_type: inquiryType || 'Academic & Keynote Speaking',
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
