# confluencr

> **AI-powered brand tweet generator** — describe your brand, get 10 on-voice tweets with full creative rationale in seconds.

**100% free to run** — powered by GROQ (1,500 requests/day, no credit card ever).

---

## What is Confluencr?

Confluencr is a web tool for marketers, founders, and social media managers who need tweet content that actually sounds like their brand — not generic AI output.

You fill in a short form: brand name, industry, campaign objective, and a brief product description. Confluencr then does two things:

**1. Brand Voice Analysis**
Before writing a single tweet, Confluencr analyses and surfaces:
- Tone of voice (e.g. "witty and irreverent with a self-aware edge")
- Target audience profile
- Core content themes
- Brand personality in one sentence
- Tone keywords, a Do/Don't guide, and competitive voice angle

**2. 10 On-Brand Tweets**
One tweet per content style, covering the full social media content funnel:

| # | Style | Purpose |
|---|---|---|
| 1 | Conversational | Relatability, invite replies |
| 2 | Promotional | Drive action, highlight offers |
| 3 | Witty / Meme | Cultural relevance, shareability |
| 4 | Informative | Expertise, value-driven content |
| 5 | Inspirational | Emotional connection, brand values |
| 6 | Behind-the-scenes | Authenticity, humanise the brand |
| 7 | Poll / CTA | Engagement, audience insight |
| 8 | Trend-jacking | Algorithmic reach, timeliness |
| 9 | Product Spotlight | Feature awareness, consideration |
| 10 | Community | Loyalty, belonging, UGC potential |

**3. Creative Rationale on every tweet**
Click "Why this?" on any tweet to see exactly why that style, tone, language, and hook was chosen — including a Brand Alignment Score (1–5).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  React Frontend (Vite)                  │   │
│   │                                                         │   │
│   │   Form inputs          Brand Voice Card                 │   │
│   │   ─────────────        ─────────────────                │   │
│   │   • Brand name         • Tone / Audience                │   │
│   │   • Industry           • Themes / Personality           │   │
│   │   • Objective          • Do & Don't                     │   │
│   │   • Products           • Tone keywords                  │   │
│   │   • Context                                             │   │
│   │                        10 Tweet Cards                   │   │
│   │                        ─────────────────                │   │
│   │                        • Tweet content                  │   │
│   │                        • Style tag + char meter         │   │
│   │                        • "Why this?" rationale panel    │   │
│   │                        • Copy / Copy All                │   │
│   └────────────────────────┬────────────────────────────────┘   │
│                            │  POST /api/generate                 │
│                            │  { brandName, industry,            │
│                            │    objective, products,            │
│                            │    extraContext }                  │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │           Serverless Function: /api/generate.js         │   │
│   │                                                         │   │
│   │   1. Validate request body                              │   │
│   │   2. Read GEMINI_API_KEY from environment               │   │
│   │   3. Build structured prompt (brand analysis +          │   │
│   │      10-tweet generation in one call)                   │   │
│   │   4. POST to Gemini API                                 │   │
│   │   5. Parse JSON response                                │   │
│   │   6. Return structured result to browser                │   │
│   │                                                         │   │
│   │   ⚠ API key NEVER leaves the server                    │   │
│   └────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
└────────────────────────────┼────────────────────────────────────┘
                             │  HTTPS POST
                             │  generativelanguage.googleapis.com
                             │  /v1beta/models/gemini-2.0-flash
                             │  :generateContent
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                                              │
│                                                                 │
│   GROQ                                            │
│   ─────────────────────────────────────────────────────────     │
│   • responseMimeType: application/json  (clean JSON output)     │
│   • temperature: 0.85  (creative but consistent)                │
│   • maxOutputTokens: 4000                                       │
│                                                                 │
│   Returns:                                                      │
│   {                                                             │
│     brandVoice: { tone, audience, themes, personality,          │
│                   toneKeywords, competitiveAngle, doAndDont }   │
│     tweets: [                                                   │
│       { style, content, hashtags,                               │
│         rationale: { styleReason, toneReason,                   │
│                      audienceReason, strategicGoal,             │
│                      hookMechanism, brandAlignmentScore } }     │
│     ]                                                           │
│   }                                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Request lifecycle

```
User submits form
      │
      ▼
Browser → POST /api/generate (brand inputs as JSON)
      │
      ▼
Vercel Serverless Function
  ├── reads GROQ_API_KEY from env vars (secure)
  ├── constructs prompt with brand context + output schema
  └── calls Gemini 2.0 Flash
            │
            ▼
        Gemini returns raw JSON
            │
            ▼
  ├── strips any accidental markdown fences
  ├── JSON.parse() validates structure
  └── returns { brandVoice, tweets[] } to browser
            │
            ▼
Browser renders:
  ├── Brand Voice Analysis card
  ├── 10 Tweet cards (staggered animation)
  └── Per-tweet rationale panel (expandable)
```

---

## Project structure

```
confluencr/
├── api/
│   └── generate.js        # Vercel serverless function — Gemini proxy
├── src/
│   ├── main.jsx           # React entry point
│   └── App.jsx            # Full UI — form, voice analysis, tweet cards
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json            # Routing: /api/* → serverless functions
├── package.json
├── .env.example           # Template for local dev
├── APPROACH.md            # Full approach document
└── README.md              # This file
```

---

## Deploy in 5 minutes (completely free)

### Step 1 — Get your free GROQ API key

1. Go to **groq cloud**
2. Click **Create API Key**
3. Copy it — looks like `AIzaSy...`

No billing. No credit card. 1,500 free requests per day.

### Step 2 — Push to GitHub

Create a repo at https://github.com/new, then:

```bash
cd confluencr
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/confluencr.git
git push -u origin main
```

Or drag-and-drop the unzipped folder into the GitHub UI.

### Step 3 — Deploy on Vercel

1. Go to https://vercel.com → **Add New Project**
2. Import your `confluencr` GitHub repo
3. Vercel auto-detects Vite — leave all settings as default
4. Scroll to **Environment Variables**, add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `AIzaSy...` (your key)
5. Click **Deploy**

Live URL in ~60 seconds.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local
npm run dev
# http://localhost:5173
```

---

## Tech stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | React 18 + Vite 5 | Free |
| Hosting + CDN | Vercel | Free |
| Backend | Vercel Serverless Functions | Free |
| AI Model | GROQ | Free (1,500 req/day) |
| Fonts | Google Fonts (Syne, Newsreader, DM Mono) | Free |

---


