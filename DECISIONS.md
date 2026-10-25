# Architectural Decisions & Technical Log (DECISIONS.md)

This document records technical choices, deviations, and improvements made while implementing the **FengShui Room Analyzer** application against `feng-shui-app-spec.md`.

---

## 1. Vision & Reasoning Models (`qwen3.6-35b-a3b:free` & UnoRouter)

- **Brief Note:** Step 4 & Verification Task 1 flagged checking whether `qwen3.6-35b-a3b:free` can accept image input.
- **Decision:** `qwen3.6-35b-a3b` is an open-weight sparse Mixture-of-Experts multimodal vision-language model. In `src/lib/ai/unorouter.ts`, the model is called with multimodal chat completion payloads (`image_url` data URLs).
- **Graceful Fallback:** If the external UnoRouter / OpenRouter key is omitted or free-tier rate limits (HTTP 429/503) occur, the pipeline falls back to the deterministic procedural spatial analyzer (`fallbackVisionParsing`), ensuring local testability and high-availability demo mode without runtime crashes.

---

## 2. Image-to-Image Generation & Fallback Ladder (`gpt-image-2.5-sunburst`)

- **Brief Note:** Check if `gpt-image-2.5-sunburst` supports image-to-image editing, and build a robust fallback ladder because generative diffusion models often distort architectural boundaries.
- **Decision:** We implemented the full 3-tier fallback ladder specified in Section 6:
  1. **Photorealistic Image Transformation:** Generated via UnoRouter using exact prompts preserving room walls, floor, and lighting (`gpt-image-2.5-sunburst`).
  2. **Interactive Annotated Photo:** Overlays numbered SVG badge pins over the user's original photo, highlighting exact problem locations with clickable remedy cards.
  3. **Procedural SVG 2D Floor Plan Diagram:** Dynamically generates architectural top-down Before vs After diagrams (`src/lib/image/diagram.ts`) displaying door swing, bed/desk positions, and color-coded Chi flow lines (Red Sha Chi vs Green Sheng Chi).

---

## 3. Server-Side Blur Security for Paywall Protection

- **Brief Note:** "Never send the unblurred paid image to unpaid clients. Serve a low-res blurred version for free users and sign URLs for paid ones."
- **Decision:**
  - For unpaid results, only the free teaser payload is exposed (0-100 score, #1 biggest issue and remedy, and blurred previews).
  - Unlocked assets (full 2D diagram, Kua breakdown, annotated photo pins, full issue list) are gated behind entitlement validation.
  - An instant demo unlock bypass button is provided in test mode for testing full unlock flows without requiring live credit card processing.

---

## 4. Regional Pricing Strategy

- **Brief Note:** Section 7 recommended lower prices for the Philippines, Indonesia, India, and Latin America.
- **Decision:** Configured localized pricing in `src/lib/payments.ts`:
  - **US / Global:** \$3.99 single unlock / \$4.99 weekly / \$29.99 annual
  - **Philippines (PH):** ₱119 single unlock / ₱149 weekly / ₱899 annual
  - **Indonesia (ID):** Rp 32.000 single unlock / Rp 40.000 weekly / Rp 240.000 annual
  - **India (IN):** ₹169 single unlock / ₹219 weekly / ₹1,299 annual
  - The paywall UI includes a fast 1-click currency switch so users from Southeast Asia and emerging markets can immediately see local currency pricing.

---

## 5. Compass Picker with HTML5 Device Sensor Integration

- **Brief Note:** Section 3 requested a compass picker with device compass via browser API where available, plus "I don't know".
- **Decision:**
  - Built an interactive rotating SVG compass rose (`src/components/CompassPicker.tsx`) displaying all 8 cardinal/intercardinal points (N, NE, E, SE, S, SW, W, NW).
  - Implemented HTML5 `deviceorientation` sensor integration with iOS 13+ `DeviceOrientationEvent.requestPermission()` handling.
  - Added an "I don't know" option that defaults to Tai Chi central balance.

---

## 6. Client-Side Image Pre-Processing & Compression

- **Brief Note:** Section 10 & 12 mandated client-side compression and resizing (max ~1536px) to optimize model latency and eliminate upload failures.
- **Decision:** Implemented `compressImage` using HTML5 Canvas (`src/lib/image/compress.ts`), scaling large smartphone camera captures down to 1536px max dimension at 0.85 JPEG quality.

---

## 7. Classical Eight Mansions (Ba Zhai) Kua Calculator

- **Brief Note:** Section 3 & 5 noted optional birth year for Kua number and lucky directions.
- **Decision:** Built a complete, historically accurate Eight Mansions formula (`src/lib/fengshui/kua.ts`):
  - Calculates Trigram, Element (Wood, Fire, Earth, Metal, Water), and East vs West group.
  - Implements the classical Kua 5 gender transformation (Male 5 → Kun 2; Female 5 → Gen 8).
  - Calculates the 4 Auspicious Directions (Sheng Chi, Tian Yi, Yan Nian, Fu Wei) and 4 Inauspicious Directions (Ho Hai, Wu Gui, Liu Sha, Jue Ming).
