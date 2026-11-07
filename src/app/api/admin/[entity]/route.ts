import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminRequest } from '@/lib/auth/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  getBooks,
  getBlogPosts,
  getCareerEntries,
  getMediaAppearances,
  getGalleryPhotos,
} from '@/lib/data/repository';
import {
  addCustomEntityItem,
  updateCustomEntityItem,
  deleteCustomEntityItem,
  loadContentOverrides,
  type ContentOverridesData,
} from '@/lib/data/custom-content-store';
import {
  validateBookPayload,
  validateBlogPostPayload,
  validateCareerPayload,
  validateMediaPayload,
  validateGalleryPayload,
  validateInquiryPayload,
  sanitizeText,
} from '@/lib/data/validation';

const VALID_ENTITIES = ['books', 'blog', 'governance', 'media', 'gallery', 'inquiries'] as const;
type ValidEntity = typeof VALID_ENTITIES[number];

const TABLE_MAP: Record<ValidEntity, string> = {
  books: 'books',
  blog: 'blog_posts',
  governance: 'career_entries',
  media: 'media_appearances',
  gallery: 'gallery_photos',
  inquiries: 'contact_submissions',
};

function isValidEntity(entity: string): entity is ValidEntity {
  return VALID_ENTITIES.includes(entity as ValidEntity);
}

function validateEntityPayload(entity: ValidEntity, body: unknown) {
  switch (entity) {
    case 'books':
      return validateBookPayload(body);
    case 'blog':
      return validateBlogPostPayload(body);
    case 'governance':
      return validateCareerPayload(body);
    case 'media':
      return validateMediaPayload(body);
    case 'gallery':
      return validateGalleryPayload(body);
    case 'inquiries':
      return validateInquiryPayload(body);
  }
}

export async function GET(
  request: Request,
  { params }: { params: { entity: string } }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  const entity = params.entity;
  if (!isValidEntity(entity)) {
    return NextResponse.json(
      { error: `Invalid entity type: ${entity}. Valid types: ${VALID_ENTITIES.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    switch (entity) {
      case 'books': {
        const books = await getBooks();
        return NextResponse.json({ ok: true, data: books, count: books.length });
      }
      case 'blog': {
        const posts = await getBlogPosts();
        return NextResponse.json({ ok: true, data: posts, count: posts.length });
      }
      case 'governance': {
        const entries = getCareerEntries();
        return NextResponse.json({ ok: true, data: entries, count: entries.length });
      }
      case 'media': {
        const media = getMediaAppearances();
        return NextResponse.json({ ok: true, data: media, count: media.length });
      }
      case 'gallery': {
        const gallery = getGalleryPhotos();
        return NextResponse.json({ ok: true, data: gallery, count: gallery.length });
      }
      case 'inquiries': {
        const store = loadContentOverrides();
        const inquiries = store.inquiries || [];
        return NextResponse.json({ ok: true, data: inquiries, count: inquiries.length });
      }
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to retrieve administrative data.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { entity: string } }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  const entity = params.entity;
  if (!isValidEntity(entity)) {
    return NextResponse.json(
      { error: `Invalid entity type: ${entity}. Valid types: ${VALID_ENTITIES.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const validation = validateEntityPayload(entity, body);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Payload validation failed.' },
        { status: 400 }
      );
    }

    const bodyRecord = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
    const id = sanitizeText(bodyRecord.id, 80) || `${entity.slice(0, 4)}-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const item = {
      ...validation.data,
      id,
      created_at: sanitizeText(bodyRecord.created_at, 40) || now,
      updated_at: now,
    };

    let source = 'local';
    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        const tableName = TABLE_MAP[entity];
        const { error } = await supabaseAdmin.from(tableName).insert(item);
        if (!error) {
          source = 'supabase';
        }
      } catch {
        // Fallback to local
      }
    }

    // Always update local persistent override cache
    const saved = addCustomEntityItem(
      entity as keyof Omit<ContentOverridesData, 'deletedIds'>,
      item
    );

    return NextResponse.json(
      { ok: true, data: saved, source },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { entity: string } }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  const entity = params.entity;
  if (!isValidEntity(entity)) {
    return NextResponse.json(
      { error: `Invalid entity type: ${entity}` },
      { status: 400 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const bodyRecord = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
    const id = sanitizeText(bodyRecord?.id, 80);
    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required for update.' },
        { status: 400 }
      );
    }

    const validation = validateEntityPayload(entity, body);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Payload validation failed.' },
        { status: 400 }
      );
    }

    const updates = {
      ...validation.data,
      id,
      updated_at: new Date().toISOString(),
    };

    let source = 'local';
    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        const tableName = TABLE_MAP[entity];
        const { error } = await supabaseAdmin
          .from(tableName)
          .update(updates)
          .eq('id', id);
        if (!error) {
          source = 'supabase';
        }
      } catch {
        // Fallback
      }
    }

    const updated = updateCustomEntityItem(
      entity as keyof Omit<ContentOverridesData, 'deletedIds'>,
      id,
      updates
    );

    return NextResponse.json({
      ok: true,
      data: updated || updates,
      source,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { entity: string } }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access. Valid passkey or session token required.' },
      { status: 401 }
    );
  }

  const entity = params.entity;
  if (!isValidEntity(entity)) {
    return NextResponse.json(
      { error: `Invalid entity type: ${entity}` },
      { status: 400 }
    );
  }

  try {
    const url = new URL(request.url);
    let id = sanitizeText(url.searchParams.get('id'), 80);

    if (!id) {
      try {
        const body = await request.json();
        id = sanitizeText(body?.id, 80);
      } catch {
        // Body was empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required for deletion.' },
        { status: 400 }
      );
    }

    let source = 'local';
    const supabaseAdmin = createSupabaseAdminClient();
    if (supabaseAdmin) {
      try {
        const tableName = TABLE_MAP[entity];
        const { error } = await supabaseAdmin.from(tableName).delete().eq('id', id);
        if (!error) {
          source = 'supabase';
        }
      } catch {
        // Fallback
      }
    }

    deleteCustomEntityItem(
      entity as keyof Omit<ContentOverridesData, 'deletedIds'>,
      id
    );

    return NextResponse.json({
      ok: true,
      deletedId: id,
      source,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete record' },
      { status: 500 }
    );
  }
}
