# Confluencr — Approach Document

**AI-powered brand tweet generator | Built for the assignment**

---

## What it does

Confluencr takes basic brand inputs and generates 10 on-brand tweets — each with a full creative rationale explaining every decision made. It also produces a brand voice analysis before generating any content.

---

## 1. How Brand Voice is Analysed

Brand voice analysis in Confluencr is **inference-based**, not scraping-based. Rather than pulling live social media data (which requires APIs, rate limits, and auth), the system asks the AI to reason from first principles using the inputs provided.

Given a brand name, industry, objective, and product description, the model infers:

| Signal | How it's inferred |
|---|---|
| **Tone** | Industry norms + brand name connotations + user-provided context |
| **Audience** | Industry category + objective type + product nature |
| **Content Themes** | Product type + campaign objective + competitive positioning |
| **Personality** | Synthesised from all inputs into a single humanised sentence |
| **Tone Keywords** | 5 single-word descriptors distilled from the tone analysis |
| **Do / Don't** | Guardrails derived from brand personality and audience expectations |
| **Competitive Angle** | What makes this brand's social voice distinct from category defaults |

This approach works well for well-known brands (Nike, Zomato, Apple) where the model has strong prior knowledge, and also for new/fictional brands where the user's description provides the signal.

---

## 2. How Prompts Are Structured

The prompt architecture follows a **two-task single-call** pattern — brand analysis and tweet generation happen in one API call, not two. This keeps latency low and ensures the tweets are directly grounded in the voice analysis.

### Prompt design principles

**System prompt — role + strict output format**
```
You are an elite brand strategist. Respond ONLY with valid JSON —
no markdown fences, no preamble, no trailing text.
```
Setting the role and output contract in the system prompt prevents the model from adding explanatory text that breaks JSON parsing.

**User prompt — structured input + explicit schema**

The user prompt has three layers:

1. **Brand inputs block** — clearly labelled key-value pairs (Brand, Industry, Objective, Products, Notes). Simple and unambiguous for the model to parse.

2. **Output schema** — the exact JSON structure is provided inline, including field names, types, and an example tweet object. This eliminates hallucinated field names and structural drift.

3. **Generation rules** — explicit constraints at the end:
   - Exact tweet order (Conversational → Community)
   - Max 280 characters per tweet
   - 1–2 hashtags inline
   - `brandAlignmentScore` must be a number 1–5
   - "Sound like [brand] genuinely wrote it"

### Rationale structure per tweet

Each tweet returns 5 explainability fields:

| Field | What it explains |
|---|---|
| `styleReason` | Why this format/style was chosen for this brand |
| `toneReason` | How word choice and structure reflect the brand tone |
| `audienceReason` | Why this resonates with the target audience |
| `strategicGoal` | What business or engagement goal the tweet serves |
| `hookMechanism` | The psychological technique used to capture attention |
| `brandAlignmentScore` | 1–5 rating of how well the tweet matches the brand voice |

This makes the AI's decisions transparent and editable — a marketer can read the rationale, disagree with a choice, and know exactly what to change.

### Why `responseMimeType: 'application/json'`

Gemini's `responseMimeType` parameter forces the model into JSON-only output mode at the API level — not just via prompt instruction. This eliminates the most common failure mode (model wrapping JSON in markdown code fences) without relying on fragile post-processing.

---

## 3. Content Generation — 10 Tweet Styles

Each tweet targets a distinct content objective and audience psychology:

| # | Style | Purpose |
|---|---|---|
| 1 | **Conversational** | Build relatability, invite replies |
| 2 | **Promotional** | Drive direct action or awareness of an offer |
| 3 | **Witty / Meme** | Cultural relevance, shareability |
| 4 | **Informative** | Establish expertise, provide value |
| 5 | **Inspirational** | Emotional connection, brand values |
| 6 | **Behind-the-scenes** | Authenticity, humanise the brand |
| 7 | **Poll / CTA** | Engagement, audience data |
| 8 | **Trend-jacking** | Reach, algorithmic visibility |
| 9 | **Product Spotlight** | Feature awareness, consideration |
| 10 | **Community** | Loyalty, belonging, UGC potential |

This mix ensures the output covers the full content funnel — awareness, engagement, conversion, and retention — rather than clustering around one style.

---

## 4. Tools & Stack

| Layer | Tool | Why |
|---|---|---|
| **Frontend** | React + Vite | Fast dev, small bundle, component model |
| **Hosting** | Vercel (free tier) | Zero-config deploy, serverless functions built-in |
| **Backend** | Vercel Serverless Function (`/api/generate.js`) | API key stays server-side, never in the browser |
| **AI Model** | Google Gemini 2.0 Flash | Free tier (1,500 req/day), fast, strong JSON output |
| **Styling** | Inline React styles | No build-time CSS dependencies, full control |
| **Fonts** | Google Fonts (Syne, Newsreader, DM Mono) | Loaded at runtime, no bundling needed |

### Architecture decision — why a backend proxy?

The GROQ API key must never be exposed in frontend code. Any key in a React bundle is readable by anyone who inspects the page source. The serverless function at `/api/generate` acts as a secure proxy — the browser calls `/api/generate`, the server calls Gemini with the key from environment variables, and only the JSON result is returned to the client.

---

## 5. What Makes It Different

Most tweet generators produce generic, interchangeable content. Confluencr's differentiation:

- **Explainability layer** — every tweet comes with a 5-point rationale, not just the output. This makes it a thinking tool, not just a generation tool.
- **Brand voice first** — tweets are generated *after* a structured voice analysis, so content strategy precedes copywriting (the correct order).
- **Style diversity enforced** — the 10-style constraint prevents the model from defaulting to its comfortable modes (usually informational or promotional).
- **Transparent scoring** — the brand alignment score lets users quickly spot which tweets need the most editing.

---

*Built with React, Vite, Vercel, and GROQ. Approach by Confluencr.*
