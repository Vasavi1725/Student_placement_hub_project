# Placement Aptitude Master

A campus placement written-test prep platform (Quant, Reasoning, Verbal, DI, Data Sufficiency,
company-wise patterns) built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase
(Auth + Postgres). No programming/DSA/technical-interview content by design.

## What's implemented in this scaffold

- **Auth**: Email/password signup+login, Google OAuth, forgot/reset password — all real Supabase Auth,
  session handled via middleware so protected routes actually redirect.
- **Database**: Full schema (`supabase/schema.sql`) with Row Level Security — profiles, subjects, topics,
  questions, companies, progress, bookmarks, notes, quiz_scores, revision_schedule, study_sessions.
- **Dashboard**: Real completion stats pulled live from Supabase.
- **Roadmap**: Subjects + topics rendered from the database as a connected track, colored by your
  actual progress status.
- **Topic page**: Overview / Formulas & Tricks / Solved Examples / Practice / Videos & References / My
  Notes — status dropdown and notes both write to Supabase (notes autosave, debounced).
- **Company pages**: Pattern table, focus topics, and strategy, all data-driven from the `companies` table.
- **Seed data** (`supabase/seed.sql`): ~35 sample topics across 3 subjects, one fully-fleshed topic
  (Percentage), and 3 companies (TCS, Infosys, Accenture) — enough to see every feature working end to end.

## What's scaffolded but not built out

To keep this a reviewable starting point rather than an unmaintainable wall of code, these are **not**
implemented yet — the schema and page structure support them, but the logic/UI still needs writing:

- Bookmarks UI, Search & Filters, Analytics dashboard (heatmap/charts), Revision planner automation
  (the `revision_schedule` table and 1/3/7/15/30-day intervals are modeled but no cron/edge function
  triggers it yet), Daily Challenge / Flashcards / Word of the Day, Achievements & Badges, Admin panel,
  PWA/offline support.
- Only ~35 of your 400+ topics are seeded. Add more rows to `supabase/seed.sql` following the same
  shape, or build an admin UI against the `topics` table.

## Setup

1. **Create a Supabase project** at supabase.com (free tier is enough to start).
2. In the Supabase SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. In Supabase → Authentication → Providers, enable **Google** (add your OAuth client ID/secret) if you
   want Google login. Email/password works out of the box.
4. In Supabase → Authentication → URL Configuration, add your site URL and
   `http://localhost:3000/auth/callback` (and your production callback URL after deploying) as redirect URLs.
5. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL + anon key
   (Project Settings → API).
6. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Visit `http://localhost:3000` — it redirects to `/login`.

## Deploying

Push this to a GitHub repo and import it in Vercel (or any Next.js host). Add the same two environment
variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the project settings, then
update the Supabase redirect URLs to include your production domain's `/auth/callback`.

## Content policy

All topic explanations, formulas, tricks, and examples in the seed data are original writing — no
scraped text. Practice questions link out to IndiaBIX rather than reproducing question banks, and
videos are referenced by title/source rather than embedded copyrighted transcripts.
