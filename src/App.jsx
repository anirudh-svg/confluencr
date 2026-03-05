import { useState, useEffect, useRef } from 'react'

const INDUSTRIES = [
  'Technology / SaaS','E-commerce / Retail','Fashion & Lifestyle',
  'Food & Beverage','Finance & Fintech','Health & Wellness',
  'Entertainment & Media','Travel & Hospitality','Education & EdTech',
  'Automotive','Beauty & Personal Care','Sports & Fitness','Other'
]
const OBJECTIVES = [
  'Brand Awareness','Product Launch','Drive Engagement',
  'Promotional / Offer','Community Building','Thought Leadership','Event Promotion'
]
const STYLE_META = {
  'Conversational':    { color:'#60a5fa', bg:'rgba(30,58,95,0.55)'  },
  'Promotional':       { color:'#fbbf24', bg:'rgba(61,46,10,0.55)'  },
  'Witty / Meme':      { color:'#f472b6', bg:'rgba(61,16,48,0.55)'  },
  'Informative':       { color:'#34d399', bg:'rgba(10,51,38,0.55)'  },
  'Inspirational':     { color:'#a78bfa', bg:'rgba(45,31,80,0.55)'  },
  'Behind-the-scenes': { color:'#818cf8', bg:'rgba(30,31,74,0.55)'  },
  'Poll / CTA':        { color:'#fb923c', bg:'rgba(61,28,8,0.55)'   },
  'Trend-jacking':     { color:'#f87171', bg:'rgba(61,16,16,0.55)'  },
  'Product Spotlight': { color:'#2dd4bf', bg:'rgba(10,48,48,0.55)'  },
  'Community':         { color:'#a3e635', bg:'rgba(30,48,16,0.55)'  },
}

// ── SVG Icons ─────────────────────────────────────────────────────────────
const Ic = {
  Copy:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Chevron: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Refresh: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Send:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Info:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Pen:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  Users:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Tag:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Chart:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Bolt:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Target:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Logo:    () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#confLg)"/>
      <path d="M6 18 L10 12 L16 18 L22 12 L26 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="confLg" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
    </svg>
  ),
}

// ── Rationale row ─────────────────────────────────────────────────────────
function RRow({ Icon: I, label, text, color }) {
  if (!text) return null
  return (
    <div style={{ display:'grid', gridTemplateColumns:'28px 1fr', gap:'10px', alignItems:'start', padding:'11px 13px', background:'rgba(255,255,255,0.025)', borderRadius:'9px', border:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ width:'26px', height:'26px', borderRadius:'6px', background:color+'15', border:`1px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center', color, flexShrink:0 }}>
        <I />
      </div>
      <div>
        <p style={{ fontSize:'9px', letterSpacing:'0.1em', color:'rgba(255,255,255,0.28)', fontFamily:"'DM Mono',monospace", marginBottom:'5px', margin:'0 0 5px' }}>{label}</p>
        <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.72)', lineHeight:'1.6', fontFamily:"'Newsreader',serif", margin:0 }}>{text}</p>
      </div>
    </div>
  )
}

// ── Tweet card ────────────────────────────────────────────────────────────
function TweetCard({ tweet, globalIndex }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen]     = useState(false)
  const [visible, setVisible] = useState(false)
  const meta  = STYLE_META[tweet.style] || { color:'#818cf8', bg:'rgba(30,31,74,0.55)' }
  const chars = tweet.content?.length || 0
  const pct   = Math.min(chars / 280 * 100, 100)
  const score = tweet.rationale?.brandAlignmentScore || 0

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), globalIndex * 55 + 60)
    return () => clearTimeout(t)
  }, [globalIndex])

  return (
    <div style={{ opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(16px)', transition:'opacity 0.48s ease, transform 0.48s cubic-bezier(0.22,1,0.36,1)', borderRadius:'14px', border:`1px solid ${open?meta.color+'30':'rgba(255,255,255,0.06)'}`, background:open?meta.bg:'rgba(255,255,255,0.022)', overflow:'hidden' }}>

      <div style={{ padding:'18px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'13px', gap:'8px' }}>
          <div style={{ display:'flex', gap:'7px', alignItems:'center' }}>
            <span style={{ fontSize:'9px', fontWeight:'700', letterSpacing:'0.09em', color:meta.color, background:meta.color+'14', padding:'3px 9px', borderRadius:'20px', fontFamily:"'DM Mono',monospace", border:`1px solid ${meta.color}25` }}>
              {tweet.style?.toUpperCase()}
            </span>
            <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.18)', fontFamily:"'DM Mono',monospace" }}>
              {String(globalIndex+1).padStart(2,'0')}
            </span>
          </div>
          <div style={{ display:'flex', gap:'5px' }}>
            <button onClick={() => setOpen(o => !o)} style={{ background:open?meta.color+'16':'rgba(255,255,255,0.04)', border:`1px solid ${open?meta.color+'30':'rgba(255,255,255,0.07)'}`, borderRadius:'7px', padding:'4px 10px', cursor:'pointer', color:open?meta.color:'rgba(255,255,255,0.38)', fontSize:'10px', fontFamily:"'DM Mono',monospace", display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s' }}>
              <Ic.Info /><span>Why this?</span>
              <span style={{ display:'inline-block', transform:open?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s' }}><Ic.Chevron /></span>
            </button>
            <button onClick={() => { navigator.clipboard.writeText(tweet.content); setCopied(true); setTimeout(()=>setCopied(false),2000) }} style={{ background:copied?'rgba(52,211,153,0.1)':'rgba(255,255,255,0.04)', border:`1px solid ${copied?'rgba(52,211,153,0.22)':'rgba(255,255,255,0.07)'}`, color:copied?'#34d399':'rgba(255,255,255,0.38)', borderRadius:'7px', padding:'4px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', fontSize:'10px', fontFamily:"'DM Mono',monospace", transition:'all 0.15s' }}>
              {copied?<><Ic.Check /><span>Copied</span></>:<><Ic.Copy /><span>Copy</span></>}
            </button>
          </div>
        </div>

        <p style={{ color:'rgba(255,255,255,0.88)', fontSize:'15px', lineHeight:'1.72', margin:'0 0 13px', fontFamily:"'Newsreader',serif" }}>
          {tweet.content}
        </p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {tweet.hashtags?.slice(0,4).map(h => (
              <span key={h} style={{ color:'#60a5fa', fontSize:'10px', fontFamily:"'DM Mono',monospace", opacity:0.6 }}>
                {h.startsWith('#')?h:'#'+h}
              </span>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
            <div style={{ width:'40px', height:'2px', borderRadius:'1px', background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:pct>90?'#f87171':pct>70?'#fbbf24':meta.color, borderRadius:'1px', transition:'width 0.5s' }}/>
            </div>
            <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.18)', fontFamily:"'DM Mono',monospace" }}>{chars}/280</span>
          </div>
        </div>
      </div>

      {open && tweet.rationale && (
        <div style={{ borderTop:`1px solid ${meta.color}18`, padding:'16px 20px 18px', animation:'slideDown 0.22s ease' }}>
          <p style={{ fontSize:'9px', letterSpacing:'0.14em', color:meta.color, fontFamily:"'DM Mono',monospace", marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ display:'inline-block', width:'14px', height:'1px', background:meta.color }}/>
            CREATIVE RATIONALE
          </p>
          <div style={{ display:'grid', gap:'7px' }}>
            <RRow Icon={Ic.Tag}   color={meta.color} label="STYLE CHOICE"       text={tweet.rationale.styleReason} />
            <RRow Icon={Ic.Pen}   color={meta.color} label="TONE & LANGUAGE"    text={tweet.rationale.toneReason} />
            <RRow Icon={Ic.Users} color={meta.color} label="AUDIENCE TARGETING" text={tweet.rationale.audienceReason} />
            <RRow Icon={Ic.Chart} color={meta.color} label="STRATEGIC GOAL"     text={tweet.rationale.strategicGoal} />
            {tweet.rationale.hookMechanism && (
              <RRow Icon={Ic.Bolt} color={meta.color} label="HOOK MECHANISM" text={tweet.rationale.hookMechanism} />
            )}
          </div>
          {score > 0 && (
            <div style={{ marginTop:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', background:'rgba(255,255,255,0.025)', borderRadius:'8px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.28)' }}>
                <Ic.Shield /><span style={{ fontSize:'9px', fontFamily:"'DM Mono',monospace", letterSpacing:'0.09em' }}>BRAND ALIGNMENT</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <div style={{ display:'flex', gap:'3px' }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ width:'14px', height:'3px', borderRadius:'2px', background:n<=score?meta.color:'rgba(255,255,255,0.07)' }}/>
                  ))}
                </div>
                <span style={{ fontSize:'10px', color:meta.color, fontFamily:"'DM Mono',monospace", fontWeight:'700' }}>{score}/5</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Voice block ───────────────────────────────────────────────────────────
function VBlock({ I, label, value, accent }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'11px', padding:'13px 15px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'7px' }}>
        <span style={{ color:accent }}><I /></span>
        <span style={{ fontSize:'9px', letterSpacing:'0.1em', color:'rgba(255,255,255,0.28)', fontFamily:"'DM Mono',monospace" }}>{label}</span>
      </div>
      <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.8)', fontFamily:"'Newsreader',serif", lineHeight:'1.55', margin:0 }}>{value}</p>
    </div>
  )
}

function TPill({ word }) {
  const pal = ['#818cf8','#f472b6','#34d399','#fbbf24','#60a5fa','#a78bfa','#fb923c','#2dd4bf']
  const c = pal[word.split('').reduce((a,b)=>a+b.charCodeAt(0),0) % pal.length]
  return <span style={{ fontSize:'10px', color:c, background:c+'13', border:`1px solid ${c}25`, borderRadius:'5px', padding:'3px 9px', fontFamily:"'DM Mono',monospace", letterSpacing:'0.05em' }}>{word}</span>
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function Confluencr() {
  const [form, setForm]     = useState({ brandName:'', industry:'', objective:'', products:'', extraContext:'' })
  const [step, setStep]     = useState('form')
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')
  const [msg, setMsg]       = useState('')
  const [filter, setFilter] = useState('All')
  const ref = useRef(null)

  const MSGS = [
    'Analysing brand DNA…','Mapping tone of voice…','Profiling the audience…',
    'Drafting tweet frameworks…','Refining language patterns…',
    'Building creative rationale…','Aligning copy to strategy…','Finalising output…'
  ]

  useEffect(() => {
    let i = 0, iv
    if (step === 'loading') {
      setMsg(MSGS[0])
      iv = setInterval(() => { i=(i+1)%MSGS.length; setMsg(MSGS[i]) }, 1600)
    }
    return () => clearInterval(iv)
  }, [step])

  const go = async () => {
    if (!form.brandName.trim()) { setError('Brand name is required.'); return }
    setError(''); setStep('loading')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || `Server error ${res.status}`)
      }

      if (!data.tweets?.length) throw new Error('No tweets returned')

      setResult(data)
      setFilter('All')
      setStep('result')
      setTimeout(() => ref.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 120)
    } catch(e) {
      setError(`Error: ${e.message || 'Something went wrong. Please try again.'}`)
      setStep('form')
    }
  }

  const reset = () => {
    setResult(null); setStep('form')
    setForm({ brandName:'', industry:'', objective:'', products:'', extraContext:'' })
    setFilter('All')
  }

  const allStyles     = result ? ['All', ...result.tweets.map(t => t.style)] : ['All']
  const visibleTweets = !result ? [] : filter === 'All' ? result.tweets : result.tweets.filter(t => t.style === filter)

  const inp = { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', padding:'11px 14px', color:'rgba(255,255,255,0.88)', fontSize:'13.5px', fontFamily:"'DM Mono',monospace", outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s' }
  const lbl = { display:'block', fontSize:'9px', letterSpacing:'0.12em', color:'rgba(255,255,255,0.28)', marginBottom:'7px', fontFamily:"'DM Mono',monospace", textTransform:'uppercase' }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Syne:wght@600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#050810;margin:0}
        ::selection{background:rgba(99,102,241,0.3)}
        input:focus,textarea:focus,select:focus{border-color:rgba(99,102,241,0.4)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.07)!important;outline:none}
        select option{background:#0c0f1f;color:#fff}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        @keyframes slideDown{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ minHeight:'100vh', background:'#050810', backgroundImage:'radial-gradient(ellipse 80% 40% at 50% -4%, rgba(99,102,241,0.13) 0%, transparent 58%), radial-gradient(ellipse 40% 28% at 88% 88%, rgba(236,72,153,0.07) 0%, transparent 50%)', fontFamily:"'Syne',sans-serif" }}>

        {/* Nav */}
        <header style={{ position:'sticky', top:0, zIndex:50, height:'50px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 26px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(5,8,16,0.88)', backdropFilter:'blur(16px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'9px', cursor:'pointer' }} onClick={reset}>
            <Ic.Logo />
            <span style={{ fontSize:'14px', fontWeight:'800', letterSpacing:'-0.03em', color:'#fff' }}>confluencr</span>
            <span style={{ fontSize:'8px', color:'#818cf8', background:'rgba(129,140,248,0.1)', border:'1px solid rgba(129,140,248,0.18)', borderRadius:'4px', padding:'2px 5px', fontFamily:"'DM Mono',monospace", letterSpacing:'0.08em' }}>BETA</span>
          </div>
          {step === 'result' && (
            <button onClick={reset} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'7px', padding:'5px 12px', color:'rgba(255,255,255,0.38)', cursor:'pointer', fontSize:'10px', fontFamily:"'DM Mono',monospace", display:'flex', alignItems:'center', gap:'6px' }}>
              <Ic.Refresh /> New brand
            </button>
          )}
        </header>

        <div style={{ maxWidth:'780px', margin:'0 auto', padding:'40px 20px 80px' }}>

          {/* Hero */}
          {step === 'form' && (
            <div style={{ textAlign:'center', marginBottom:'40px', animation:'up 0.55s ease both' }}>
              <p style={{ fontSize:'9px', letterSpacing:'0.16em', color:'rgba(255,255,255,0.28)', fontFamily:"'DM Mono',monospace", marginBottom:'20px' }}>
                <span style={{ display:'inline-block', width:'5px', height:'5px', borderRadius:'50%', background:'#6366f1', verticalAlign:'middle', marginRight:'6px', animation:'blink 2.2s infinite' }}/>
                AI BRAND VOICE ENGINE
              </p>
              <h1 style={{ fontSize:'clamp(34px,7vw,60px)', fontWeight:'800', letterSpacing:'-0.04em', color:'#fff', lineHeight:1.07, marginBottom:'16px' }}>
                Tweets that sound<br />
                <span style={{ background:'linear-gradient(105deg,#818cf8,#ec4899 55%,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>exactly like you.</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'15px', fontFamily:"'Newsreader',serif", fontStyle:'italic', lineHeight:1.65, maxWidth:'420px', margin:'0 auto' }}>
                Describe your brand. Confluencr analyses your voice and generates 10 tweets — each with a full creative rationale.
              </p>
            </div>
          )}

          {/* Form */}
          {step === 'form' && (
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'18px', padding:'30px 34px', animation:'up 0.6s 0.08s ease both' }}>

              <div style={{ marginBottom:'26px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'16px' }}>
                  <span style={{ width:'18px', height:'1px', background:'rgba(129,140,248,0.5)' }}/>
                  <span style={{ fontSize:'9px', letterSpacing:'0.14em', color:'#818cf8', fontFamily:"'DM Mono',monospace" }}>01 — BRAND IDENTITY</span>
                </div>
                <div style={{ display:'grid', gap:'14px' }}>
                  <div>
                    <label style={lbl}>Brand Name <span style={{ color:'#f87171' }}>*</span></label>
                    <input style={inp} placeholder="Nike, Zomato, Notion, Duolingo…" value={form.brandName} onChange={e => setForm(f => ({ ...f, brandName:e.target.value }))} onKeyDown={e => e.key==='Enter' && go()} />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <div>
                      <label style={lbl}>Industry</label>
                      <select style={{ ...inp, cursor:'pointer' }} value={form.industry} onChange={e => setForm(f => ({ ...f, industry:e.target.value }))}>
                        <option value="">Select…</option>
                        {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Objective</label>
                      <select style={{ ...inp, cursor:'pointer' }} value={form.objective} onChange={e => setForm(f => ({ ...f, objective:e.target.value }))}>
                        <option value="">Select…</option>
                        {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom:'26px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'16px' }}>
                  <span style={{ width:'18px', height:'1px', background:'rgba(52,211,153,0.5)' }}/>
                  <span style={{ fontSize:'9px', letterSpacing:'0.14em', color:'#34d399', fontFamily:"'DM Mono',monospace" }}>02 — PRODUCTS & CONTEXT</span>
                </div>
                <div style={{ display:'grid', gap:'14px' }}>
                  <div>
                    <label style={lbl}>Products / Services</label>
                    <textarea style={{ ...inp, resize:'vertical', minHeight:'78px', lineHeight:'1.65' }} placeholder="What does your brand offer? More detail = more authentic tweets." value={form.products} onChange={e => setForm(f => ({ ...f, products:e.target.value }))} />
                  </div>
                  <div>
                    <label style={lbl}>Additional Context <span style={{ fontSize:'8px', color:'rgba(255,255,255,0.16)', textTransform:'none', letterSpacing:0 }}>optional</span></label>
                    <textarea style={{ ...inp, resize:'vertical', minHeight:'65px', lineHeight:'1.65' }} placeholder="Tone references, audience language, what to avoid…" value={form.extraContext} onChange={e => setForm(f => ({ ...f, extraContext:e.target.value }))} />
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ color:'#f87171', fontSize:'11px', fontFamily:"'DM Mono',monospace", background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.16)', borderRadius:'7px', padding:'9px 12px', marginBottom:'16px' }}>
                  {error}
                </div>
              )}

              <button onClick={go} style={{ width:'100%', background:'linear-gradient(120deg,#6366f1,#8b5cf6 48%,#ec4899)', border:'none', borderRadius:'11px', padding:'15px', color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', letterSpacing:'0.07em', fontFamily:"'DM Mono',monospace", boxShadow:'0 4px 28px rgba(99,102,241,0.32)', transition:'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 7px 36px rgba(99,102,241,0.42)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 28px rgba(99,102,241,0.32)' }}>
                <Ic.Send /> GENERATE 10 TWEETS + RATIONALE
              </button>
              <p style={{ textAlign:'center', fontSize:'9px', color:'rgba(255,255,255,0.14)', fontFamily:"'DM Mono',monospace", marginTop:'10px' }}>
                Every tweet includes style choice · tone analysis · audience targeting · strategic goal
              </p>
            </div>
          )}

          {/* Loading */}
          {step === 'loading' && (
            <div style={{ textAlign:'center', padding:'88px 20px', animation:'up 0.35s ease' }}>
              <div style={{ width:'52px', height:'52px', margin:'0 auto 28px', position:'relative' }}>
                {[{c:'#6366f1',d:'0.85s',s:1},{c:'#8b5cf6',d:'1.1s',s:0.68},{c:'#ec4899',d:'0.7s',s:0.4}].map((r,i) => (
                  <div key={i} style={{ position:'absolute', top:`${(1-r.s)*50}%`, left:`${(1-r.s)*50}%`, width:`${r.s*100}%`, height:`${r.s*100}%`, border:'1.5px solid transparent', borderTopColor:r.c, borderRadius:'50%', animation:`spin ${r.d} linear infinite` }}/>
                ))}
              </div>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.06em', marginBottom:'6px' }}>{msg}</p>
              <p style={{ fontSize:'9px', color:'rgba(255,255,255,0.16)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em' }}>CONFLUENCR — POWERED BY CLAUDE AI</p>
            </div>
          )}

          {/* Results */}
          {step === 'result' && result && (
            <div ref={ref} style={{ animation:'up 0.45s ease' }}>
              <div style={{ marginBottom:'24px' }}>
                <h2 style={{ fontSize:'24px', fontWeight:'800', letterSpacing:'-0.03em', color:'#fff', marginBottom:'3px' }}>{form.brandName}</h2>
                <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.25)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.07em' }}>
                  {[form.industry, form.objective].filter(Boolean).join(' — ') || 'BRAND OUTPUT'}
                </p>
              </div>

              {/* Voice analysis */}
              <div style={{ background:'rgba(99,102,241,0.055)', border:'1px solid rgba(99,102,241,0.14)', borderRadius:'16px', padding:'22px 24px', marginBottom:'12px' }}>
                <p style={{ fontSize:'9px', letterSpacing:'0.14em', color:'#818cf8', fontFamily:"'DM Mono',monospace", marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'16px', height:'1px', background:'rgba(129,140,248,0.6)' }}/> BRAND VOICE ANALYSIS
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:'9px', marginBottom:'14px' }}>
                  <VBlock I={Ic.Pen}    label="Tone"              accent="#818cf8" value={result.brandVoice?.tone} />
                  <VBlock I={Ic.Users}  label="Audience"          accent="#60a5fa" value={result.brandVoice?.audience} />
                  <VBlock I={Ic.Tag}    label="Content Themes"    accent="#34d399" value={result.brandVoice?.themes} />
                  <VBlock I={Ic.Target} label="Brand Personality" accent="#f472b6" value={result.brandVoice?.personality} />
                </div>
                {result.brandVoice?.toneKeywords?.length > 0 && (
                  <div style={{ marginBottom:'12px' }}>
                    <p style={{ fontSize:'9px', color:'rgba(255,255,255,0.22)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', marginBottom:'7px' }}>TONE KEYWORDS</p>
                    <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                      {result.brandVoice.toneKeywords.map(k => <TPill key={k} word={k}/>)}
                    </div>
                  </div>
                )}
                {result.brandVoice?.doAndDont && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px', marginBottom:'9px' }}>
                    <div style={{ background:'rgba(52,211,153,0.05)', border:'1px solid rgba(52,211,153,0.12)', borderRadius:'9px', padding:'11px 13px' }}>
                      <p style={{ fontSize:'9px', color:'#34d399', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', marginBottom:'5px' }}>DO</p>
                      <p style={{ fontSize:'12.5px', color:'rgba(255,255,255,0.62)', fontFamily:"'Newsreader',serif", lineHeight:'1.55', margin:0 }}>{result.brandVoice.doAndDont.do}</p>
                    </div>
                    <div style={{ background:'rgba(248,113,113,0.05)', border:'1px solid rgba(248,113,113,0.12)', borderRadius:'9px', padding:'11px 13px' }}>
                      <p style={{ fontSize:'9px', color:'#f87171', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', marginBottom:'5px' }}>AVOID</p>
                      <p style={{ fontSize:'12.5px', color:'rgba(255,255,255,0.62)', fontFamily:"'Newsreader',serif", lineHeight:'1.55', margin:0 }}>{result.brandVoice.doAndDont.dont}</p>
                    </div>
                  </div>
                )}
                {result.brandVoice?.competitiveAngle && (
                  <div style={{ background:'rgba(251,191,36,0.05)', border:'1px solid rgba(251,191,36,0.12)', borderRadius:'9px', padding:'11px 13px' }}>
                    <p style={{ fontSize:'9px', color:'#fbbf24', fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', marginBottom:'5px' }}>COMPETITIVE VOICE ANGLE</p>
                    <p style={{ fontSize:'12.5px', color:'rgba(255,255,255,0.62)', fontFamily:"'Newsreader',serif", lineHeight:'1.55', margin:0 }}>{result.brandVoice.competitiveAngle}</p>
                  </div>
                )}
              </div>

              {/* Tweets */}
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', margin:'24px 0 10px', flexWrap:'wrap', gap:'8px' }}>
                <div>
                  <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#fff', letterSpacing:'-0.02em', marginBottom:'2px' }}>10 Generated Tweets</h3>
                  <p style={{ fontSize:'9px', color:'rgba(255,255,255,0.22)', fontFamily:"'DM Mono',monospace" }}>Click "Why this?" on any tweet to expand the rationale</p>
                </div>
                <button onClick={() => navigator.clipboard.writeText((result.tweets||[]).map((t,i)=>`${i+1}. [${t.style}]\n${t.content}`).join('\n\n'))} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'7px', padding:'6px 12px', color:'rgba(255,255,255,0.38)', cursor:'pointer', fontSize:'9px', fontFamily:"'DM Mono',monospace", display:'flex', alignItems:'center', gap:'5px' }}>
                  <Ic.Copy /> COPY ALL
                </button>
              </div>

              <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'14px' }}>
                {allStyles.map(s => {
                  const active = filter === s
                  const c = s==='All'?'#818cf8':(STYLE_META[s]?.color||'#818cf8')
                  return (
                    <button key={s} onClick={() => setFilter(s)} style={{ fontSize:'9px', letterSpacing:'0.07em', padding:'4px 10px', borderRadius:'5px', cursor:'pointer', fontFamily:"'DM Mono',monospace", border:`1px solid ${active?c+'38':'rgba(255,255,255,0.06)'}`, background:active?c+'10':'rgba(255,255,255,0.015)', color:active?c:'rgba(255,255,255,0.27)', transition:'all 0.12s' }}>
                      {s==='All'?'ALL':s.toUpperCase()}
                    </button>
                  )
                })}
              </div>

              <div style={{ display:'grid', gap:'8px' }}>
                {visibleTweets.map(tweet => (
                  <TweetCard key={tweet.style} tweet={tweet} globalIndex={(result.tweets||[]).indexOf(tweet)} />
                ))}
              </div>

              <p style={{ textAlign:'center', marginTop:'40px', fontSize:'9px', color:'rgba(255,255,255,0.1)', fontFamily:"'DM Mono',monospace", letterSpacing:'0.08em' }}>
                CONFLUENCR — POWERED BY CLAUDE AI — ALWAYS REVIEW BEFORE POSTING
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
