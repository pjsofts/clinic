import crypto from 'node:crypto';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://pjsofts.github.io,http://localhost:8080')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function corsHeaders(request) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function json(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  });
}

export function preflight(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function readJson(request, limit = 10_000) {
  const text = await request.text();
  if (text.length > limit) throw new Error('too_large');
  return JSON.parse(text || '{}');
}

export function clientIpHash(request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  return crypto.createHash('sha256').update(ip + (process.env.ADMIN_PASSWORD || '')).digest('hex').slice(0, 32);
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function isAdmin(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const user = process.env.ADMIN_USER || 'admin';
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  const sep = decoded.indexOf(':');
  if (sep === -1) return false;
  return safeEqual(decoded.slice(0, sep), user) && safeEqual(decoded.slice(sep + 1), password);
}
