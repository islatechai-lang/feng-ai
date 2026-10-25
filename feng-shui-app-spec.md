# FengShui Room Analyzer: Full App Brief for the Build Agent

> You are building this app end to end. Everything below is the spec and the intent. **You are encouraged to add anything that makes the app better, fix gaps, and flag anything I missed.** If something here is technically wrong or a better option exists, use the better option and note it in a `DECISIONS.md`.

---

## 1. One-liner

Upload a photo of your room, tell us which way the door faces, and get a feng shui score, a list of problems, how to fix them, and an AI-generated image of your room rearranged the right way, with the reasons explained.

## 2. Target users

- People moving into a new place, renters, and anyone redecorating
- Strong markets: Philippines, Indonesia, Malaysia, Singapore, India, Chinese diaspora, LatAm, US/EU hobbyists
- Mobile first. Most users will open this on a phone browser, so it must feel like a native app (installable PWA).

## 3. Core user flow

1. **Landing / onboarding**: one screen, clear promise, "Analyze my room" button. No signup before the first result.
2. **Upload**: take or choose a photo of a room (camera capture on mobile). Optional second photo from another angle.
3. **Context form** (fast, 4 taps max):
   - Room type: bedroom, living room, office/desk, kitchen, shop/business
   - Direction the main door faces (compass picker; also offer device compass via browser API where available, plus "I don't know")
   - Goal: money, sleep/calm, love, career, health
   - Optional: birth year (for personal Kua number / lucky directions)
4. **Analysis screen** with a nice loading animation (10-30s). Show progress steps ("Reading your layout... Checking the command position...").
5. **Free result (always shown):**
   - Overall Feng Shui Score (0-100)
   - The #1 biggest problem, with a short explanation
   - A **blurred / locked preview** of the regenerated room image
   - A teaser list: "7 more issues found" with titles blurred
6. **Paywall** (see section 7).
7. **Full result (paid):**
   - Full issue list (severity, what, why, fix)
   - Regenerated image of the room with the improved layout (before/after slider)
   - Annotated original photo (numbered markers on problem items)
   - Lucky directions, colors, and elements for the user's goal (and Kua number if birth year given)
   - Shopping/decor suggestions (generic, no affiliate links at v1)
   - Share card (before/after image with score, app watermark)
8. **History**: saved analyses per user, re-open any time.

## 4. Tech stack (mandated)

- **Frontend/app:** Next.js (App Router) + React + TypeScript. Tailwind CSS (plus shadcn/ui or similar). Smooth, clean, modern, aesthetic. Soft gradients, rounded cards, subtle animations (Framer Motion). Dark and light mode. Installable PWA.
- **Database/Auth/Storage:** Supabase (Postgres, Auth, Storage, Row Level Security on every table).
- **Image generation/editing:** via **unorouter**, model `gpt-image-2.5-sunburst`.
- **Text/reasoning ("the brain"):** model `qwen3.6-35b-a3b:free`.
- **Payments:** see section 7.

### Important verification tasks (do these first)

1. **Check that the text model can accept image input.** If `qwen3.6-35b-a3b:free` is text-only, use a vision-capable model (through unorouter or another provider) for the room-reading step, and keep the Qwen model for the reasoning, scoring, and explanation steps. Document the choice.
2. **Check that `gpt-image-2.5-sunburst` supports image-to-image editing** (taking the original photo plus an instruction). If it only does text-to-image, use another edit-capable model, or fall back to the annotated-photo/top-down-layout approach in section 6.
3. **Read the unorouter docs** for the exact endpoint, auth, rate limits, response format, and image size limits. Don't guess.
4. **Free-tier models have rate limits and can be slow or unavailable.** Add retries, timeouts, a queue, and a graceful fallback. Make the model names config via env vars so they can be swapped without code changes.

## 5. AI pipeline

Run as a server-side job (Next.js route handlers or Supabase Edge Functions). Never expose API keys to the client.

**Step 1: Vision parsing.** Input: photo(s) + context. Output: strict JSON listing detected objects (bed, desk, door, window, mirror, stove, plants, etc.), their approximate position (wall, corner, center, relative to door), what faces what, clutter level, lighting, and colors. Use JSON schema / structured output and validate with Zod. Retry on invalid JSON.

**Step 2: Feng shui reasoning.** Input: the JSON from step 1 + door direction + goal + optional Kua data. Apply classical principles:
- Command position (bed/desk sees the door without being in line with it)
- Bed placement (not under beams, not in line with the door, solid headboard wall, not under windows)
- Mirrors facing the bed
- Clutter and flow (chi flow, door-to-window alignment)
- Five elements and colors per sector (Bagua map using the door direction)
- Water/fire conflicts (kitchen, stove, plants)
- Lucky and unlucky directions (Eight Mansions / Kua) when birth year is given

Output strict JSON: score, issues[] (id, title, severity, explanation, fix, which object), lucky_directions, colors, elements, suggested_layout (a list of object moves in plain, simple language).

**Step 3: Image edit prompt builder.** Convert `suggested_layout` into one clear edit instruction for the image model, e.g. "Keep the same room, walls, lighting and style. Move the bed to the left wall so it faces the door diagonally. Move the desk..." Always include "keep everything else unchanged".

**Step 4: Image generation** via unorouter with the original photo as input. Generate 2 candidates if cost allows and pick the better one (or use a cheap check). Store in Supabase Storage.

**Step 5: Save** results to the DB and mark the job done. The client polls or subscribes (Supabase Realtime) for progress.

## 6. Fallbacks (important, regeneration is unreliable)

Image models often change the room too much or break the geometry. Build a fallback ladder:

1. Edited photo (preferred)
2. **Annotated original photo** (numbered markers and arrows drawn with canvas/SVG over the original)
3. **Top-down layout diagram**, drawn in SVG from the JSON: before vs. after

Always include the annotated photo or diagram in the paid result, even when the generated image works, because it is the most reliable "what exactly do I move" view.

## 7. Monetization and paywall

- **Free:** 1 analysis, score + #1 issue + blurred preview. No credit card.
- **Paid options** (present as simple cards, annual or best-value highlighted):
  - **Single room unlock**: one-time, about $3.99
  - **Weekly pass**: about $4.99/week (movers and decorators use it intensely for a few days)
  - **Pro yearly**: about $29.99/year, unlimited analyses with a fair-use cap on image generations
- **Regional pricing**: lower prices for PH, India, Indonesia, LatAm.
- **Payment provider:** web first. Use **Stripe** (or Lemon Squeezy / Paddle if better for global tax handling) with webhooks that update a `entitlements` table in Supabase. Keep payment logic behind an interface so the app can be wrapped for Play Store later (Google Play Billing, RevenueCat). Flag any policy issues.
- **Blur implemented server-side**: never send the unblurred paid image to unpaid clients. Serve a low-res blurred version for free users and sign URLs for paid ones.
- **Cost controls:** per-user daily limits, a cap on regenerations per purchase, cache results by image hash + context, compress and resize uploads (max about 1536px) before sending to models.

## 8. Database (Supabase) suggested schema

- `profiles` (id, display_name, birth_year, country, created_at)
- `analyses` (id, user_id, status, room_type, door_direction, goal, input_image_path, parsed_json, result_json, score, created_at)
- `analysis_images` (id, analysis_id, kind: original/edited/annotated/diagram/share_card, path)
- `entitlements` (user_id, plan, credits_remaining, expires_at, provider, provider_customer_id)
- `payments` (id, user_id, provider, amount, currency, status, created_at)
- `usage_logs` (id, user_id, model, tokens_in, tokens_out, cost_estimate, created_at) for cost tracking
- `feedback` (id, analysis_id, rating, comment)

RLS on all tables: users can only read and write their own rows. Storage buckets are private with signed URLs. Anonymous (guest) sessions allowed for the first free analysis, then prompt signup to save and unlock (merge guest data on signup).

## 9. Screens

Landing, Upload, Context form, Loading/progress, Free result, Paywall, Full result (tabs: Issues / Before-After / Lucky guide), Share, History, Account/Billing, Settings, Legal (Terms, Privacy, Disclaimer), and a simple admin page (users, usage and cost, errors).

## 10. Growth and virality features

- **Shareable before/after card** with score, the app name, and a QR code or link (auto-generated image, nicely designed for TikTok, IG Stories and Reels aspect ratio)
- "Challenge a friend": share a link, and both get a bonus analysis
- Referral credits
- SEO landing pages ("feng shui bedroom layout", "feng shui for desk", "feng shui door direction") with example analyses
- Email capture for the "lucky dates to move or rearrange" reminder (v2)

## 11. Trust, safety and compliance

- Clear disclaimer: for entertainment and traditional-practice guidance only, not professional design, medical, financial or legal advice. No promises of outcomes.
- Photos are private, deleted on request, and auto-deleted after N days for free users. Say this clearly in the UI.
- Do not store faces if avoidable: detect people in photos and warn the user or blur them.
- Reject NSFW or irrelevant photos politely.
- GDPR/CCPA-friendly: export and delete my data.
- Rate limiting, abuse protection (Turnstile or similar), and input validation on uploads (type, size).

## 12. Quality, performance and polish

- Image upload with client-side compression and HEIC to JPEG conversion
- Skeleton loaders, optimistic UI, great empty and error states
- Accessibility (contrast, labels, keyboard support)
- i18n-ready from day one (English first; Tagalog, Bahasa, Chinese, Spanish later)
- Analytics (PostHog or similar) tracking the funnel: upload, analysis done, paywall view, purchase
- Error monitoring (Sentry)
- Tests for the parsing and JSON validation, and basic E2E for the main flow
- Seed with sample rooms so the demo flow works without uploading

## 13. Future ideas (don't build in v1, but design so they are easy to add)

- Floor-plan mode (upload a floor plan and get a room-by-room analysis)
- Lucky dates to move in or rearrange (integration with a calendar of auspicious dates)
- Multi-room home report as a single PDF
- Dream journal module
- Play Store wrapper (Capacitor or TWA) and Google Play Billing via RevenueCat
- Marketplace affiliate links for the suggested decor items

## 14. Deliverables

1. Working app in a Git repo, with a README (setup, env vars, how to run, how to deploy to Vercel)
2. `.env.example` with all variables (Supabase, unorouter key and base URL, model names, payment keys)
3. SQL migrations and RLS policies
4. `DECISIONS.md`: every deviation from this brief, with a reason
5. `TODO.md`: anything you found missing, risky, or worth adding next

**Reminder: you have freedom to improve this. If you see a missing feature, a smarter flow, a cheaper way to run the AI, or a better conversion trick, add it and document it.**
