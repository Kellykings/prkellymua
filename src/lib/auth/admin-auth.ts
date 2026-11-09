import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'kmk_admin_session';

const DEFAULT_DEV_PASSKEY = 'kmk-governance-2026!';

function getAdminPasskey(): string {
  return process.env.ADMIN_PASSKEY || process.env.ADMIN_STUDIO_PASSCODE || DEFAULT_DEV_PASSKEY;
}

function getSecretKey(): string {
  return process.env.DOWNLOAD_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'kmk-hmac-secret-vault-2026';
}

export function verifyPasskey(inputPasskey: string): boolean {
  if (!inputPasskey || typeof inputPasskey !== 'string') return false;
  const expected = getAdminPasskey();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputPasskey),
      Buffer.from(expected)
    );
  } catch {
    return inputPasskey === expected;
  }
}

export function createAdminSessionToken(): string {
  const timestamp = Date.now().toString();
  const data = `admin:${timestamp}`;
  const hmac = crypto.createHmac('sha256', getSecretKey());
  hmac.update(data);
  const signature = hmac.digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [timestamp, signature] = token.split('.');
  const time = parseInt(timestamp, 10);
  if (isNaN(time)) return false;

  // Session lasts 7 days (604,800,000 ms)
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - time > MAX_AGE) return false;

  const data = `admin:${timestamp}`;
  const hmac = crypto.createHmac('sha256', getSecretKey());
  hmac.update(data);
  const expectedSignature = hmac.digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return signature === expectedSignature;
  }
}

export function verifyAdminRequest(request: Request): boolean {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token === getAdminPasskey() || verifyAdminSessionToken(token)) {
      return true;
    }
  }

  // 2. Check Cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]*)`));
  if (match && match[1]) {
    const cookieToken = decodeURIComponent(match[1]);
    return verifyAdminSessionToken(cookieToken);
  }

  return false;
}

interface RateLimitRecord {
  failedAttempts: number;
  blockedUntil: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  // Never block localhost in development mode
  if (process.env.NODE_ENV !== 'production' && (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost')) {
    return { allowed: true };
  }

  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (now > record.blockedUntil && record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { failedAttempts: 0, blockedUntil: 0 };
  record.failedAttempts += 1;
  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_WINDOW_MS;
  }
  loginAttempts.set(ip, record);
}

export function recordSuccessfulLogin(ip: string): void {
  loginAttempts.delete(ip);
}
