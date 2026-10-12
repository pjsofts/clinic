# دل آسا — Psychology Clinic Website

Persian (RTL) website for the Del Asa psychology clinic: services, therapist directory,
and a "request a call back" form for booking consultations.

| Part | Where | Live URL |
| --- | --- | --- |
| Public site + admin page (`site/`) | GitHub Pages | https://pjsofts.github.io/clinic/ — admin at `/clinic/admin/` |
| API (`api/`) | Vercel serverless functions | https://del-asa-clinic.vercel.app |
| Database | Neon Postgres (via Vercel Marketplace) | — |

## Deploying

- **Site:** push to `main` — the GitHub Actions workflow in `.github/workflows/pages.yml` publishes `site/`.
- **API:** `npx vercel deploy --prod` from the repo root (or connect the GitHub repo in the Vercel dashboard for auto-deploys).

Vercel environment variables:

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Set automatically by the Neon integration |
| `ADMIN_PASSWORD` | Password for the admin page (username `admin`, or set `ADMIN_USER`) |
| `ALLOWED_ORIGINS` | Comma-separated origins allowed to call the API (`https://pjsofts.github.io,http://localhost:8080`) |

The site finds the API through `site/config.js` (`CLINIC_API_URL`).

## Editing content

- **Therapists:** `site/therapists.json`. Fields: `id` (lowercase letters, digits, `-`), `name`, `title`, `degree`,
  `license`, `specialties[]`, `bio`, `sessionTypes` (`in-person` / `online`), `days`, optional `photo`
  (e.g. `images/x.jpg` placed in `site/images/`).
  ⚠️ The included therapists are **placeholder sample data** — replace them before real use.
- **Clinic phone / address / hours:** footer of `site/index.html` (also placeholders).
- **Texts & services:** `site/index.html`. Colors: tokens at the top of `site/styles.css`.

## Themes

Seventeen designs share the same content and form (ids listed in `site/theme.js`; `calm` is the default).

- Gallery to send to the clinic: https://pjsofts.github.io/clinic/themes.html
- Preview one directly: `https://pjsofts.github.io/clinic/?theme=night` (preview links show a theme switcher bar).
- Pick the final theme: set `CLINIC_DEFAULT_THEME` in `site/config.js`.
- Theme list/descriptions: `site/theme.js`. Each theme is `site/themes/<id>.css` (calm included), overriding the tokens at the top
  of `site/styles.css`. Gallery thumbnails live in `site/themes/previews/`.

## Admin page

`/clinic/admin/` — log in with the admin password. Lists call-back requests (newest first) with tap-to-call
phone links, and lets staff move each one through: جدید → تماس گرفته شد → نوبت داده شد → بسته شد.

## Local development

```bash
npm install
npx vercel env pull .env.local   # gets DATABASE_URL etc.
npm run dev:api                  # API on http://localhost:3000
npm run dev:site                 # site on http://localhost:8080
```

For local testing, set `CLINIC_API_URL` in `site/config.js` to `http://localhost:3000` (don't commit that).

## Notes

- Spam protection: honeypot field + 5 submissions per visitor per 10 minutes (stored as a salted IP hash).
- The admin password is kept in the browser's `sessionStorage` until the tab closes or you click خروج.
