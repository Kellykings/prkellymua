import {
  createServerClient as createSSRServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey ||
    url.includes('your-project-id') ||
    anonKey.includes('your-supabase')
  ) {
    return null;
  }

  const cookieStore = cookies();

  return createSSRServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component context: cookie mutation ignored safely
        }
      },
    },
  });
}
