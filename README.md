# JuttShortLink — Vercel / Netlify

A static front end with serverless APIs for creating and resolving short links. Visitors can explicitly choose to share location, take a camera photo, or record audio locally. Denying permissions never blocks the destination. Audio is not uploaded.

## Important: storage is required

The project uses Upstash Redis to persist short-code mappings and consent records. Without Redis credentials, the site can open but link creation and resolution will fail. Camera, microphone, and geolocation require HTTPS (or localhost).

Set these environment variables in the hosting dashboard:

- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token
- `ADMIN_PASSWORD` — a strong, private admin password
- `BLOB_READ_WRITE_TOKEN` — required only if you want visitor photos stored in Vercel Blob
- `BASE_URL` — optional; normally leave unset so the deployed hostname is detected automatically

## Deploy to Vercel

1. Import this folder/repository into Vercel with the project root set to this folder (Framework Preset: Other, leave Output Directory empty). Static files live in `public/`.
2. Add the environment variables above in Project Settings → Environment Variables.
3. Redeploy after adding the variables.
4. Open the deployment URL. The homepage is `/`, admin is `/admin`, and short links use `/s/CODE`.

## Deploy to Netlify

1. Create a new site by importing this folder/repository into Netlify.
2. Set the base directory to the project root (the folder containing `netlify.toml`).
3. Add `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `ADMIN_PASSWORD` in Site configuration → Environment variables. Add `BLOB_READ_WRITE_TOKEN` only for photo storage.
4. Deploy. `netlify.toml` configures the functions and clean routes.

## Privacy and security notes

- Location sharing and camera capture require an explicit visitor action; camera photos are uploaded only after the visitor taps **Take photo**.
- Microphone recording is explicit and remains in the visitor's browser; it is not uploaded by this starter.
- Consent records may contain location coordinates and a public photo URL. Protect the admin password and configure retention/deletion policies before public use.
- This starter does not include rate limiting, abuse prevention, or a full privacy policy. Add these before public launch.
