import fs from 'fs';
import path from 'path';
import type {
  Book,
  BlogPost,
  CareerEntry,
  MediaAppearance,
  GalleryPhotoItem,
} from '@/types/domain';

export interface ProtocolInquiryItem {
  id: string;
  sender_name: string;
  sender_email: string;
  organization?: string | null;
  inquiry_type: string;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
  admin_note?: string;
}

export interface ContentOverridesData {
  books: Book[];
  blog: BlogPost[];
  governance: CareerEntry[];
  media: MediaAppearance[];
  gallery: GalleryPhotoItem[];
  inquiries: ProtocolInquiryItem[];
  deletedIds: Record<string, string[]>;
}

export interface ContentStoreHealth {
  isHealthy: boolean;
  storePath: string;
  fileExists: boolean;
  totalActiveOverrides: number;
  totalDeletedTombstones: number;
  counts: {
    books: number;
    blog: number;
    governance: number;
    media: number;
    gallery: number;
    inquiries: number;
  };
  tombstones: {
    books: number;
    blog: number;
    governance: number;
    media: number;
    gallery: number;
    inquiries: number;
  };
  lastModified?: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'content-overrides.json');
const MAX_ITEMS_PER_ENTITY = 200;

const DEFAULT_STORE: ContentOverridesData = {
  books: [],
  blog: [],
  governance: [],
  media: [],
  gallery: [],
  inquiries: [],
  deletedIds: {
    books: [],
    blog: [],
    governance: [],
    media: [],
    gallery: [],
    inquiries: [],
  },
};

// In-memory cache for fast server-side access and read-only/ephemeral fallback
let memoryStore: ContentOverridesData = { ...DEFAULT_STORE };
let isStoreLoaded = false;

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Non-blocking in read-only / ephemeral environments
  }
}

export function loadContentOverrides(): ContentOverridesData {
  if (isStoreLoaded) {
    return memoryStore;
  }

  try {
    ensureDataDir();
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      if (!raw || raw.trim().length === 0) {
        memoryStore = { ...DEFAULT_STORE };
      } else {
        const parsed = JSON.parse(raw);
        memoryStore = {
          books: Array.isArray(parsed.books) ? parsed.books : [],
          blog: Array.isArray(parsed.blog) ? parsed.blog : [],
          governance: Array.isArray(parsed.governance) ? parsed.governance : [],
          media: Array.isArray(parsed.media) ? parsed.media : [],
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
          deletedIds: parsed.deletedIds && typeof parsed.deletedIds === 'object'
            ? parsed.deletedIds
            : {
                books: [],
                blog: [],
                governance: [],
                media: [],
                gallery: [],
                inquiries: [],
              },
        };
      }
    } else {
      memoryStore = { ...DEFAULT_STORE };
    }
  } catch {
    // Corrupted file recovery: fallback safely without crashing
    memoryStore = { ...DEFAULT_STORE };
  }

  isStoreLoaded = true;
  return memoryStore;
}

export function saveContentOverrides(data: ContentOverridesData): void {
  memoryStore = { ...data };
  try {
    ensureDataDir();
    const serialized = JSON.stringify(data, null, 2);

    // Atomic write pattern: write to temporary file first, then atomically rename
    const tmpFile = path.join(DATA_DIR, `content-overrides.${Date.now()}.${Math.random().toString(36).slice(2, 6)}.tmp`);
    fs.writeFileSync(tmpFile, serialized, 'utf-8');
    try {
      fs.renameSync(tmpFile, STORE_FILE);
    } catch {
      // Direct write fallback for file locks across Windows partitions
      fs.writeFileSync(STORE_FILE, serialized, 'utf-8');
      if (fs.existsSync(tmpFile)) {
        try { fs.unlinkSync(tmpFile); } catch {}
      }
    }
  } catch {
    // Non-blocking in ephemeral or read-only deployments
  }
}

export function getContentStoreHealth(): ContentStoreHealth {
  const store = loadContentOverrides();
  let fileExists = false;
  let lastModified: string | undefined;

  try {
    if (fs.existsSync(STORE_FILE)) {
      fileExists = true;
      const stats = fs.statSync(STORE_FILE);
      lastModified = stats.mtime.toISOString();
    }
  } catch {}

  const counts = {
    books: store.books?.length || 0,
    blog: store.blog?.length || 0,
    governance: store.governance?.length || 0,
    media: store.media?.length || 0,
    gallery: store.gallery?.length || 0,
    inquiries: store.inquiries?.length || 0,
  };

  const tombstones = {
    books: store.deletedIds?.books?.length || 0,
    blog: store.deletedIds?.blog?.length || 0,
    governance: store.deletedIds?.governance?.length || 0,
    media: store.deletedIds?.media?.length || 0,
    gallery: store.deletedIds?.gallery?.length || 0,
    inquiries: store.deletedIds?.inquiries?.length || 0,
  };

  const totalActive = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalDeleted = Object.values(tombstones).reduce((a, b) => a + b, 0);

  return {
    isHealthy: true,
    storePath: STORE_FILE,
    fileExists,
    totalActiveOverrides: totalActive,
    totalDeletedTombstones: totalDeleted,
    counts,
    tombstones,
    lastModified,
  };
}

export function getCustomEntityItems<T>(entityKey: keyof Omit<ContentOverridesData, 'deletedIds'>): T[] {
  const store = loadContentOverrides();
  return (store[entityKey] || []) as unknown as T[];
}

export function getDeletedEntityIds(entityKey: string): string[] {
  const store = loadContentOverrides();
  return store.deletedIds?.[entityKey] || [];
}

export function addCustomEntityItem<T extends { id: string }>(
  entityKey: keyof Omit<ContentOverridesData, 'deletedIds'>,
  item: T
): T {
  const store = loadContentOverrides();
  let list = [...(store[entityKey] as unknown as T[])];

  // If item with same ID existed, update it; otherwise prepend
  const idx = list.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }

  // Cap at maximum capacity to prevent unbounded storage inflation
  if (list.length > MAX_ITEMS_PER_ENTITY) {
    list = list.slice(0, MAX_ITEMS_PER_ENTITY);
  }

  // Remove from deletedIds if re-added
  const deleted = (store.deletedIds?.[entityKey] || []).filter((id) => id !== item.id);

  const updated: ContentOverridesData = {
    ...store,
    [entityKey]: list,
    deletedIds: {
      ...store.deletedIds,
      [entityKey]: deleted,
    },
  };

  saveContentOverrides(updated);
  return item;
}

export function updateCustomEntityItem<T extends { id: string }>(
  entityKey: keyof Omit<ContentOverridesData, 'deletedIds'>,
  id: string,
  updates: Partial<T>
): T | null {
  const store = loadContentOverrides();
  const list = [...(store[entityKey] as unknown as T[])];

  const idx = list.findIndex((i) => i.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    const updated: ContentOverridesData = {
      ...store,
      [entityKey]: list,
    };
    saveContentOverrides(updated);
    return list[idx];
  }

  return null;
}

export function deleteCustomEntityItem(
  entityKey: keyof Omit<ContentOverridesData, 'deletedIds'>,
  id: string
): boolean {
  const store = loadContentOverrides();
  const list = (store[entityKey] as unknown as Array<{ id: string }>).filter((i) => i.id !== id);

  const deletedSet = new Set(store.deletedIds?.[entityKey] || []);
  deletedSet.add(id);

  const updated: ContentOverridesData = {
    ...store,
    [entityKey]: list,
    deletedIds: {
      ...store.deletedIds,
      [entityKey]: Array.from(deletedSet),
    },
  };

  saveContentOverrides(updated);
  return true;
}
