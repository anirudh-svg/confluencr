export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured. Set GEMINI_API_KEY in Vercel environment variables.' });
  }

  const { brandName, industry, objective, products, extraContext } = req.body || {};

  if (!brandName) {
    return res.status(400).json({ error: 'brandName is required' });
  }

  const prompt = `You are an elite brand strategist. Respond ONLY with valid JSON — no markdown fences, no preamble, no trailing text.

Analyse this brand and return 10 tweets with full rationale.

Brand: ${brandName}
Industry: ${industry || 'unspecified'}
Objective: ${objective || 'general brand presence'}
Products/Services: ${products || 'unspecified'}
Notes: ${extraContext || 'none'}

Return EXACTLY this JSON (nothing else):
{
  "brandVoice": {
    "tone": "string",
    "audience": "string",
    "themes": "string",
    "personality": "string",
    "toneKeywords": ["w1","w2","w3","w4","w5"],
    "competitiveAngle": "string",
    "doAndDont": { "do": "string", "dont": "string" }
  },
  "tweets": [
    {
      "style": "Conversational",
      "content": "tweet text under 280 chars #hashtag",
      "hashtags": ["#hashtag"],
      "rationale": {
        "styleReason": "string",
        "toneReason": "string",
        "audienceReason": "string",
        "strategicGoal": "string",
        "hookMechanism": "string",
        "brandAlignmentScore": 4
      }
    }
  ]
}

Generate 10 tweets, one per style in this exact order:
Conversational, Promotional, Witty / Meme, Informative, Inspirational, Behind-the-scenes, Poll / CTA, Trend-jacking, Product Spotlight, Community.

Rules:
- Each tweet under 280 characters with 1-2 hashtags inline
- Sound like ${brandName} genuinely wrote it
- brandAlignmentScore is a number 1-5`;

  try {
    // Gemini 1.5 Flash: FREE tier = 1,500 requests/day, no credit card needed
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 4000,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      return res.status(geminiRes.status).json({
        error: errData?.error?.message || `Gemini API error ${geminiRes.status}`
      });
    }

    const data  = await geminiRes.json();
    const raw   = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(clean);

    if (!parsed.tweets?.length) {
      return res.status(500).json({ error: 'No tweets in AI response' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Confluencr error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
