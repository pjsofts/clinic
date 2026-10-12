import { sql, ensureSchema } from '../_lib/db.js';
import { json, preflight, readJson, isAdmin } from '../_lib/http.js';
import { STATUSES } from '../_lib/validate.js';

export function OPTIONS(request) {
  return preflight(request);
}

// GET /api/admin/requests — list the latest requests.
export async function GET(request) {
  if (!isAdmin(request)) return json(request, 401, { error: 'unauthorized' });
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT id, name, phone, therapist_id, session_type, preferred_time, message, status, created_at
      FROM requests ORDER BY id DESC LIMIT 500
    `;
    return json(request, 200, rows);
  } catch (err) {
    console.error(err);
    return json(request, 500, { error: 'server error' });
  }
}

// PATCH /api/admin/requests?id=123 { status } — move a request through the workflow.
export async function PATCH(request) {
  if (!isAdmin(request)) return json(request, 401, { error: 'unauthorized' });

  const id = Number(new URL(request.url).searchParams.get('id'));
  let body;
  try {
    body = await readJson(request);
  } catch {
    return json(request, 400, { error: 'bad request' });
  }
  if (!Number.isInteger(id) || id < 1) return json(request, 422, { error: 'invalid id' });
  if (!STATUSES.includes(body.status)) return json(request, 422, { error: 'invalid status' });

  try {
    const rows = await sql`UPDATE requests SET status = ${body.status} WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return json(request, 404, { error: 'not found' });
    return json(request, 200, { ok: true });
  } catch (err) {
    console.error(err);
    return json(request, 500, { error: 'server error' });
  }
}
