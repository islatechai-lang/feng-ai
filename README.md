# FengShui AI Room Analyzer 🪷

> **Classical Chinese Feng Shui (Bagua & Eight Mansions) powered by modern spatial vision and generative AI.**

Upload a photo of your room, indicate your door's compass orientation, and get an instant Feng Shui score, identification of the #1 critical energy leak, and an AI-rearranged layout in true Command Position.

---

## ✨ Features

- **📱 Mobile-First PWA Experience:** Native app feel on smartphones with camera capture, responsive cards, and installable manifest.
- **🧭 Interactive Compass Picker:** 8-direction cardinal dial with HTML5 device orientation sensor integration ("Use Phone Compass") and fallback mode.
- **👁️ Spatial Vision & Reasoning Pipeline:**
  - Multimodal parsing with `qwen3.6-35b-a3b:free` via UnoRouter / OpenRouter.
  - Classical Bagua, Five-Element balance, and Eight Mansions (Ba Zhai) Kua number formulas.
  - Image transformation via `gpt-image-2.5-sunburst`.
- **🛡️ 3-Tier Fallback Ladder:**
  1. Photorealistic AI room rearrangement (preserving walls, floor, and style).
  2. Annotated original photo with interactive numbered issue pins.
  3. Procedural SVG 2D Floor Plan diagram (Before vs After) with color-coded Chi flow vectors.
- **🔒 Server-Side Blur Paywall & Monetization:**
  - Free tier: 0-100 score + #1 biggest issue + blurred preview.
  - Paid options: Single room unlock (\$3.99), Mover's weekly pass (\$4.99/wk), Pro annual (\$29.99/yr).
  - Regional pricing for the Philippines (₱119), Indonesia (Rp 32.000), and India (₹169).
  - Stripe integration + instant test mode unlock.
- **📱 TikTok & IG Story Share Card (9:16):** Auto-generated vertical social share card with score badge, before/after preview, and Web Share API support.
- **📊 Admin Telemetry Dashboard (`/admin`):** Real-time monitoring of token consumption, estimated API costs, model routing latencies, and error logs.
- **📜 Legal & Compliance:** Full Traditional Practice Disclaimer, GDPR Right-to-Erasure tool, and 30-day auto-purge policy.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Validation:** [Zod](https://zod.dev/)
- **Database / Auth / Storage:** [Supabase](https://supabase.com/) with Row-Level Security (RLS)
- **AI Gateway:** UnoRouter / OpenRouter (`qwen3.6-35b-a3b:free` + `gpt-image-2.5-sunburst`)
- **Payments:** Stripe Checkout & Webhooks

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/feng-ai.git
cd feng-ai
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update variables as needed:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `UNOROUTER_API_KEY` | UnoRouter / OpenRouter API Key | Optional (runs in demo fallback mode if empty) |
| `UNOROUTER_BASE_URL` | AI Gateway Base URL | `https://openrouter.ai/api/v1` |
| `REASONING_MODEL` | Reasoning & scoring model | `qwen3.6-35b-a3b:free` |
| `VISION_MODEL` | Spatial vision model | `qwen3.6-35b-a3b:free` |
| `IMAGE_MODEL` | Room editing model | `gpt-image-2.5-sunburst` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Optional for local demo |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Optional for local demo |
| `STRIPE_SECRET_KEY` | Stripe secret key | Optional (uses simulated test unlock if omitted) |

### 3. Run Unit Tests

```bash
npm test
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

```bash
npm run build
npm start
```

---

## 🗄️ Database Setup (Supabase)

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Run the complete migration script located in [`supabase/migrations/20261025000000_init_schema.sql`](file:///c:/Users/Admin/Desktop/proj/feng-ai/supabase/migrations/20261025000000_init_schema.sql).
4. This sets up all 7 tables (`profiles`, `analyses`, `analysis_images`, `entitlements`, `payments`, `usage_logs`, `feedback`), indexes, and Row Level Security policies.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), click **Add New Project** and import `feng-ai`.
3. Add the environment variables from your `.env.local`.
4. Click **Deploy**. Vercel will build and deploy the Next.js App Router application automatically.

---

## 📄 Key Documentation

- [`feng-shui-app-spec.md`](file:///c:/Users/Admin/Desktop/proj/feng-ai/feng-shui-app-spec.md): Original product brief.
- [`DECISIONS.md`](file:///c:/Users/Admin/Desktop/proj/feng-ai/DECISIONS.md): Architectural decisions, model choices, and fallback rationale.
- [`TODO.md`](file:///c:/Users/Admin/Desktop/proj/feng-ai/TODO.md): Risk mitigation, future roadmap, and extensions.
