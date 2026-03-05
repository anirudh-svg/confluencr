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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured. Set GROQ_API_KEY in Vercel environment variables.' });
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

Return EXACTLY this JSON (nothing else, no backticks, no explanation):
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
- brandAlignmentScore is a number 1-5
- Return raw JSON only, no markdown`;

  try {
    // Groq: FREE — 14,400 requests/day, no credit card needed
    // Models: llama-3.3-70b-versatile (best quality, free)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an elite brand strategist. You always respond with valid raw JSON only — no markdown fences, no backticks, no preamble, no explanation. Just the JSON object.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.85,
        max_tokens: 4000,
        response_format: { type: 'json_object' }  // forces clean JSON output
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({
        error: errData?.error?.message || `Groq API error ${groqRes.status}`
      });
    }

    const data   = await groqRes.json();
    const raw    = data?.choices?.[0]?.message?.content || '';
    const clean  = raw.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();
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
