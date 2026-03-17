# PlaceRight

PlaceRight is a trust-first campus placement automation platform built with React, Vite, Tailwind, Zustand, Recharts, and optional Supabase. It ships with a fully working demo mode, so the app runs immediately on Netlify even without any backend configuration.

## What It Includes

- Resume parsing in the browser with `pdfjs-dist`
- Resume Trust Score with internal-consistency breakdown
- Resume fingerprinting and plagiarism detection
- Skill authenticity analysis for each claimed skill
- JD parsing, JD quality analysis, and drive Autopilot
- Match scoring, placement probability prediction, and anonymous batch benchmarking
- Smart interview scheduling and smart waitlist promotion
- Interviewer bias and fatigue monitoring
- Performance map for diamonds vs paper tigers
- Student, admin, and interviewer dashboards
- Demo seed dataset with 30 students, 8 companies, 5 drives, evaluations, alerts, and feedback

## Demo Accounts

- `admin@placeright.com` / `admin123`
- `student@placeright.com` / `student123`
- `interviewer@placeright.com` / `interview123`

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and add Supabase values if you want live persistence:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=PlaceRight
```

If the Supabase variables are missing, the app automatically switches to demo mode and shows a banner that data is not persisted.

## Netlify Deployment

1. Push the project to GitHub.
2. Create a new Netlify site from the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only if you want backend persistence.
6. Deploy.

`public/_redirects` and `netlify.toml` are already configured for SPA routing.

## Supabase Setup

1. Create a new Supabase project.
2. Run the SQL in `supabase/migrations/001_schema.sql`.
3. Create storage buckets named `resumes` and `videos`.
4. Disable email confirmation if you want the same instant signup flow as demo mode.
5. Add the Supabase environment variables to Netlify.

## Project Structure

The app follows the requested production structure:

- `src/config`: constants, Supabase bridge, demo data
- `src/store`: Zustand state for auth, students, drives, and UI
- `src/lib`: parsing, scoring, trust, plagiarism, scheduling, reporting, and analytics engines
- `src/components`: layout, UI primitives, shared widgets, and domain modules
- `src/pages`: routed pages for admin, student, and interviewer roles
- `supabase/migrations`: database schema

## Notes

- Demo mode is the fastest way to review the product end to end.
- Resume-derived fields are intentionally read-only for students.
- All standout features are implemented with client-side logic and no paid APIs.
