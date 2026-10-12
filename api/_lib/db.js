import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

let schemaReady;

// Creates the table on the first request after a cold start; cheap no-op afterwards.
export function ensureSchema() {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS requests (
        id             SERIAL PRIMARY KEY,
        name           TEXT NOT NULL,
        phone          TEXT NOT NULL,
        therapist_id   TEXT,
        session_type   TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        message        TEXT,
        status         TEXT NOT NULL DEFAULT 'new',
        ip_hash        TEXT,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS requests_ip_recent ON requests (ip_hash, created_at)`;
  })().catch((err) => {
    schemaReady = undefined;
    throw err;
  });
  return schemaReady;
}
