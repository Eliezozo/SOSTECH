# Sostech Systems — Website

Bilingual (EN/FR) marketing site + admin CMS for **Sostech Systems**, a security,
CCTV and surveillance company in Accra, Ghana.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS · Supabase · Nodemailer**.

---

## Features

- 5 public pages: Home, Services, Projects, About, Contact
- URL-based bilingual routing (`/en`, `/fr`) with automatic language detection
- Projects page with hover-preview videos and a fullscreen lightbox
- Contact form that sends real emails (server-side via Nodemailer)
- `/admin` dashboard (Supabase Auth) to upload project videos/photos, manage a
  gallery, and edit key site texts — all without touching code
- Dynamic content falls back to built-in defaults when Supabase is not configured

---

## 1. Install & run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open http://localhost:3000 — you are redirected to `/en` or `/fr`.
Admin dashboard: http://localhost:3000/admin

---

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill it in. On Vercel, add the same
variables under **Project → Settings → Environment Variables**.

### Supabase (admin, media storage, dynamic content)

`Supabase Dashboard → Settings → API`

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | `media` |

### Email (contact form — Nodemailer SMTP)

| Variable | Example |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | your sending address |
| `SMTP_PASS` | an **App Password** (not your normal password) |
| `CONTACT_TO` | `sostechgh@aol.com` |
| `CONTACT_FROM` | `"Sostech Systems Website <your-address@gmail.com>"` |

> **Gmail:** enable 2-Step Verification, then create an *App Password*
> (Google Account → Security → App passwords) and use it as `SMTP_PASS`.

---

## 3. Supabase setup (one time)

1. Create a project at https://supabase.com
2. **SQL Editor → New query** → paste the contents of `supabase-setup.sql` → **Run**
3. **Storage → New bucket** → name `media` → enable **Public bucket**
4. **Authentication → Users → Add user** → create your admin email + password
   (in **Authentication → Providers → Email**, turn off "Confirm email" for
   instant activation)
5. Put the API keys in `.env.local` (see above)

Now log in at `/admin` and start uploading.

---

## 4. Deploy to Vercel

- Framework preset: **Next.js** (auto-detected)
- Add all environment variables from step 2
- Deploy. The `/admin` route is `noindex` and excluded from `robots.txt`.

---

## Project structure

```
app/
  [locale]/            # public pages (en/fr) with shared header/footer
  admin/               # Supabase-authenticated dashboard
  api/contact/         # Nodemailer email endpoint
components/            # UI + admin components
lib/
  i18n/                # locale config + EN/FR dictionaries
  supabase/            # browser + server clients, upload helper
  content.ts           # dynamic content loaders (with fallback)
public/                # logo, hero image, project videos
```

---

## Editing content without code

The `/admin` **Textes du site** tab overrides these keys (empty = keep default):

- `home.hero.desc` — homepage hero paragraph
- `about.intro` — About intro
- `contact.info.addressValue` — address shown in contact + footer
- `footer.desc` — footer description
