import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  saveStoredHeroConfig,
  resetStoredHeroConfig,
} from '@/lib/data/custom-content-store';
import { getHeroConfig, getDefaultHeroConfig } from '@/lib/data/repository';
import { validateHeroCopyPayload } from '@/lib/data/validation';

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  try {
    const config = await getHeroConfig();
    return NextResponse.json({ ok: true, data: config });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve hero configuration.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validation = validateHeroCopyPayload(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Invalid hero copy configuration payload.' },
        { status: 400 }
      );
    }

    const heroData = validation.data;

    // 1. Local content store persistence (atomic staging)
    saveStoredHeroConfig(heroData);

    // 2. Supabase Cloud PostgreSQL persistence (if connected)
    let supabasePersisted = false;
    try {
      const supabaseAdmin = createSupabaseAdminClient();
      if (supabaseAdmin) {
        const { error } = await supabaseAdmin
          .from('site_settings')
          .upsert(
            {
              key: 'hero_copy',
              value: heroData,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );

        if (!error) {
          supabasePersisted = true;
        } else {
          console.warn('Supabase site_settings upsert warning:', error.message);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase site_settings sync fallback:', sbErr);
    }

    return NextResponse.json({
      ok: true,
      message: supabasePersisted
        ? 'Hero copy updated successfully across Supabase Cloud and local store.'
        : 'Hero copy updated successfully in local atomic store (offline fallback active).',
      data: heroData,
      store: supabasePersisted ? 'dual_sync' : 'local_fallback',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update hero configuration.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  try {
    // 1. Reset local store
    resetStoredHeroConfig();

    // 2. Delete from Supabase (if connected)
    try {
      const supabaseAdmin = createSupabaseAdminClient();
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('site_settings')
          .delete()
          .eq('key', 'hero_copy');
      }
    } catch (sbErr) {
      console.warn('Supabase site_settings delete warning:', sbErr);
    }

    const defaults = getDefaultHeroConfig();
    return NextResponse.json({
      ok: true,
      message: 'Hero section copy reset to factory dictionary defaults.',
      data: defaults,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset hero configuration.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
