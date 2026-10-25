# FengShui AI Roadmap & Risks (TODO.md)

This backlog documents future feature expansions, technical risks, and operational optimizations following the v1 release.

---

## 1. High Priority (v1.1 - v1.2)

- [ ] **Multi-Angle Photo Synthesis:** Expand vision parser from single-angle photo to dual-angle perspective stitching to accurately detect blind-spot items (e.g. wardrobe facing opposite wall).
- [ ] **Automated Face Obfuscation:** Integrate client-side TensorFlow.js / BlazeFace detection to blur family portraits or people present in room photos before uploading to storage.
- [ ] **Email Capture & Auspicious Calendar Reminders:** Capture user emails for "Auspicious Dates to Rearrange" notifications based on the Chinese Lunar Calendar (Tung Shing).
- [ ] **Capacitor / TWA Play Store Wrapper:** Wrap the Next.js PWA into an Android `.apk` and iOS `.ipa` with RevenueCat integration for native Google Play Billing.

---

## 2. Medium Priority (v1.5 - v2.0)

- [ ] **Whole-Home Floor Plan Mode (Section 13):** Upload 2D architectural blueprints or hand-drawn sketches to receive room-by-room Bagua sector zoning.
- [ ] **Multi-Room Home Report as PDF:** Generate printable 12-page branded Feng Shui audit reports for interior designers and real estate agents.
- [ ] **Affiliate Marketplace Decor Links:** Partner with sustainable furniture and decor providers (bamboo plants, singing bowls, unlacquered brass hardware, ergonomic desks) for suggested cures.
- [ ] **Multi-Language Localization (i18n):** Complete translation files for Tagalog (PH), Bahasa Indonesia (ID), Traditional/Simplified Chinese, and Spanish (LatAm).

---

## 3. Technical Risks & Mitigation Strategies

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **UnoRouter / Free-Tier Rate Limits (HTTP 429)** | User receives slow or failed analysis during traffic spikes. | Implemented exponential backoff retries (2 attempts) + automatic procedural fallback engine with realistic room transformations. |
| **Generative Hallucinations (Image Geometry Warping)** | AI image alters room windows or removes doors, reducing trust. | Implemented 2D Floor Plan SVG diagrams and annotated badge overlays as the primary reliable architectural guidance. |
| **Stripe Webhook Delivery Failures** | User pays but report remains locked. | Webhook handler uses idempotency keys; client features a test-mode / instant unlock recovery option and session caching. |
| **Mobile Browser Camera Memory Exhaustion** | 48MP raw mobile photos crash browser tabs. | Client-side Canvas downsampling to 1536px before server transmission. |
