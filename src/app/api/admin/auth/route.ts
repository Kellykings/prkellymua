import { NextResponse } from 'next/server';
import {
  verifyPasskey,
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from '@/lib/auth/admin-auth';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Account temporarily locked for security. Please retry in ${rateLimit.retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const passkey = body?.passkey;

    if (!passkey || !verifyPasskey(passkey)) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: 'Invalid administrative passkey. Access denied.' },
        { status: 401 }
      );
    }

    recordSuccessfulLogin(ip);
    const token = createAdminSessionToken();
    const response = NextResponse.json({
      ok: true,
      message: 'Administrative session authorized.',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Malformed authentication request.' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    ok: true,
    message: 'Administrative session cleared.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
