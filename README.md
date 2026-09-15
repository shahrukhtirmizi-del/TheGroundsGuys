# The Grounds Guys of Davenport, FL

Marketing and free-estimate site for The Grounds Guys of Davenport, FL. Next.js 16 (App Router), Tailwind v4, deployed on Vercel.

## Run it

```bash
npm install
npm run dev
```

`npm run build` produces the production build. Both `dev` and `build` first copy the MapLibre worker into `public/maplibre` (see `scripts/copy-maplibre-worker.mjs`); that folder is generated and git-ignored.

## Lead delivery (the free-estimate form)

The form posts to `/api/estimate`, which validates the request and delivers it by whichever channel is configured. Copy `.env.example` and set **one** of:

- `RESEND_API_KEY` + `ESTIMATE_TO_EMAIL` (+ optional `ESTIMATE_FROM_EMAIL`) to email each lead via [Resend](https://resend.com)
- `ESTIMATE_WEBHOOK_URL` to POST the lead JSON to Zapier, Make or a CRM

With neither set, the lead is written to the server log and the visitor still sees the thank-you state. Set the variables in Vercel under Project > Settings > Environment Variables.

## Logo

Drop the real Grounds Guys logo into `public/` as `logo.svg` or `logo.png` and the header and footer use it automatically. Add `logo-mark.png` (square) for the favicon. Until then a brand-colored wordmark and a placeholder icon stand in.

## Assets

`public/` holds the client-supplied photography (`service-*.jpg`, `before-lawn.jpg`, `after-lawn.jpg`, `team-crew.jpg`, `cta-wide-shot.jpg`) and the hero cinemagraph. `hero-video.mp4` is the supplied aerial shot transcoded to 1080p and ping-ponged so the loop is seamless; `hero-poster.jpg` is its first frame.

## Where things live

- `src/lib/site.ts`: every piece of business content (services, FAQ, reviews, towns, hours)
- `src/components/sections/*`: one file per home-page section, in page order
- `src/components/fx/OrbitHeading.tsx`: the canvas ring of orbiting photo plates
- `src/components/ui/*`: reveal, count-up, stars, tilt card, modal, scroll-words
- `src/app/api/geocode`: address lookup proxy for the service-area check (OpenStreetMap Nominatim)
