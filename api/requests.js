import { sql, ensureSchema } from './_lib/db.js';
import { json, preflight, readJson, clientIpHash } from './_lib/http.js';
import { validateRequest } from './_lib/validate.js';

// At most 5 submissions per visitor every 10 minutes.
const RATE_MAX = 5;

export function OPTIONS(request) {
  return preflight(request);
}

export async function POST(request) {
  let body;
  try {
    body = await readJson(request);
  } catch {
    return json(request, 400, { error: 'درخواست نامعتبر است.' });
  }

  // Honeypot field: real visitors never see or fill it.
  if (body.website) return json(request, 201, { ok: true });

  const { data, errors } = validateRequest(body);
  if (Object.keys(errors).length) return json(request, 422, { errors });

  try {
    await ensureSchema();
    const ipHash = clientIpHash(request);
    const [{ count }] = await sql`
      SELECT count(*)::int AS count FROM requests
      WHERE ip_hash = ${ipHash} AND created_at > now() - interval '10 minutes'
    `;
    if (count >= RATE_MAX) {
      return json(request, 429, { error: 'تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه بعد دوباره تلاش کنید.' });
    }

    await sql`
      INSERT INTO requests (name, phone, therapist_id, session_type, preferred_time, message, ip_hash)
      VALUES (${data.name}, ${data.phone}, ${data.therapistId}, ${data.sessionType}, ${data.preferredTime}, ${data.message}, ${ipHash})
    `;
    return json(request, 201, { ok: true });
  } catch (err) {
    console.error(err);
    return json(request, 500, { error: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
}
