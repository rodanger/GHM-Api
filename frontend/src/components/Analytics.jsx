import React, { useState, useEffect, useRef } from "react"

const BASE = "http://127.0.0.1:8000/api"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Syne:wght@400;600;700&display=swap');

  .an-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0d0d0d;
    transition: background .3s;
    color: #e0e0e0;
    padding-top: 88px;
  }

  .an-inner { max-width: 1200px; margin: 0 auto; padding: 32px 24px 80px; }

  .an-header { margin-bottom: 40px; }
  .an-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  .an-subtitle { font-size: 13px; color: rgba(255,255,255,0.3); font-weight: 300; }

  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 36px; }
  .kpi-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(12px);
    animation: fadeUp 0.5s ease forwards;
  }
  .kpi-card:nth-child(1) { animation-delay: 0.05s; }
  .kpi-card:nth-child(2) { animation-delay: 0.1s; }
  .kpi-card:nth-child(3) { animation-delay: 0.15s; }
  .kpi-card:nth-child(4) { animation-delay: 0.2s; }
  .kpi-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
  }
  .kpi-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 12px; }
  .kpi-value { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 6px; }
  .kpi-sub { font-size: 12px; color: rgba(255,255,255,0.25); }
  .kpi-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); opacity: 0.06; font-size: 56px; }

  .an-section {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 24px;
    opacity: 0;
    transform: translateY(12px);
    animation: fadeUp 0.5s ease forwards;
  }
  .an-section:nth-child(1) { animation-delay: 0.25s; }
  .an-section:nth-child(2) { animation-delay: 0.35s; }
  .an-section:nth-child(3) { animation-delay: 0.45s; }
  .an-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .an-section-title span { font-size: 11px; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.3); font-weight: 300; }

  .bar-chart { display: flex; flex-direction: column; gap: 10px; }
  .bar-row { display: grid; grid-template-columns: 140px 1fr 60px; gap: 12px; align-items: center; }
  .bar-label { font-size: 12px; color: rgba(255,255,255,0.5); text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
  .bar-fill {
    height: 100%;
    border-radius: 4px;
    background: var(--bar-color, #4f46e5);
    width: 0;
    animation: growBar 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards;
    animation-delay: var(--delay, 0s);
  }
  @keyframes growBar { to { width: var(--target-width); } }
  .bar-qty { font-size: 12px; color: rgba(255,255,255,0.4); font-variant-numeric: tabular-nums; }

  .low-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .low-card {
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 10px;
    padding: 14px 16px;
    position: relative;
    overflow: hidden;
  }
  .low-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: #ef4444;
    border-radius: 2px 0 0 2px;
  }
  .low-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .low-card-top-left { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; margin-right: 10px; }
  .low-logo { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); overflow: hidden; flex-shrink: 0; }
  .low-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
  .low-logo-initials { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.2); letter-spacing: 0.05em; }
  .low-type-badge { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
  .low-name { font-size: 13px; font-weight: 500; color: #fecaca; }
  .low-brand { font-size: 11px; color: rgba(255,255,255,0.3); margin-bottom: 8px; margin-top: 4px; }
  .low-progress { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 6px; }
  .low-progress-fill { height: 100%; background: #ef4444; border-radius: 2px; transition: width 1s ease; }
  .low-numbers { display: flex; justify-content: space-between; font-size: 11px; }
  .low-current { color: #f87171; font-weight: 500; }
  .low-min { color: rgba(255,255,255,0.25); }

  .all-good {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 40px; gap: 12px; color: rgba(255,255,255,0.25); font-size: 13px;
  }
  .all-good-icon { font-size: 36px; }

  .an-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  @media (max-width: 768px) { .an-two-col { grid-template-columns: 1fr; } .bar-row { grid-template-columns: 100px 1fr 50px; } }

  .value-list { display: flex; flex-direction: column; gap: 8px; }
  .value-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
  .value-name { font-size: 13px; color: rgba(255,255,255,0.6); }
  .value-amount { font-size: 13px; font-weight: 500; color: #a5b4fc; font-variant-numeric: tabular-nums; }
  .value-total-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: rgba(99,102,241,0.08); border-radius: 8px; border: 1px solid rgba(99,102,241,0.2); margin-top: 8px; }
  .value-total-label { font-size: 13px; font-weight: 500; color: #c7d2fe; }
  .value-total-amount { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #a5b4fc; }

  .an-loading { display: flex; align-items: center; justify-content: center; height: 300px; }
  .an-spinner { width: 32px; height: 32px; border: 2px solid rgba(255,255,255,0.08); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.8s linear infinite; }

  /* ── AI Agent (same as Dashboard) ── */
  .ai-fab { position:fixed; bottom:28px; right:28px; width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 24px rgba(0,0,0,0.4); transition:transform .2s, box-shadow .2s; z-index:100; }
  .ai-fab:hover { transform:scale(1.08); background:rgba(255,255,255,0.2); }
  .ai-panel { position:fixed; bottom:92px; right:28px; width:370px; height:500px; background:#0f0f13; border:1px solid rgba(255,255,255,0.08); border-radius:16px; display:flex; flex-direction:column; z-index:100; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.6); animation:slideUp .25s cubic-bezier(0.34,1.56,0.64,1); }
  .ai-header { padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.03); }
  .ai-dot { width:8px; height:8px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px #4ade80; animation:pulse-dot 2s infinite; }
  .ai-header-title { font-size:13px; font-weight:500; color:#e0e0e0; }
  .ai-header-sub { font-size:11px; color:rgba(255,255,255,0.25); margin-left:auto; }
  .ai-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.08) transparent; }
  .ai-msg { max-width:85%; font-size:13px; line-height:1.5; padding:9px 13px; border-radius:10px; animation:fadeMsg .2s ease; font-family:'DM Sans',sans-serif; }
  .ai-msg.user { background:rgba(255,255,255,0.12); color:#fff; align-self:flex-end; border-bottom-right-radius:3px; }
  .ai-msg.assistant { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.06); color:#d0d0d0; align-self:flex-start; border-bottom-left-radius:3px; white-space:pre-wrap; }
  .ai-typing { display:flex; gap:4px; align-items:center; padding:10px 13px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.06); border-radius:10px; border-bottom-left-radius:3px; align-self:flex-start; }
  .ai-typing span { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.3); animation:bounce 1.2s infinite; }
  .ai-typing span:nth-child(2) { animation-delay:.2s; }
  .ai-typing span:nth-child(3) { animation-delay:.4s; }
  .ai-input-area { padding:10px 14px; border-top:1px solid rgba(255,255,255,0.06); display:flex; gap:8px; align-items:center; }
  .ai-input { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:7px; padding:8px 11px; color:#e0e0e0; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; transition:border-color .2s; }
  .ai-input:focus { border-color:rgba(255,255,255,0.3); }
  .ai-input::placeholder { color:rgba(255,255,255,0.2); }
  .ai-send { width:34px; height:34px; border-radius:7px; background:rgba(255,255,255,0.15); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; flex-shrink:0; }
  .ai-send:hover { background:rgba(255,255,255,0.25); }
  .ai-send:disabled { opacity:.4; cursor:not-allowed; }
  .close-btn { background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; padding:2px; display:flex; transition:color .2s; margin-left:auto; }
  .close-btn:hover { color:rgba(255,255,255,0.7); }

  :root.light .an-root { background: #f4f4f8 !important; color: #1a1a2e; }
  :root.light .an-title { color: #1a1a2e !important; }
  :root.light .an-subtitle { color: rgba(0,0,0,0.35) !important; }
  :root.light .kpi-card { background: #fff !important; border-color: rgba(0,0,0,0.08) !important; }
  :root.light .kpi-label { color: rgba(0,0,0,0.4) !important; }
  :root.light .kpi-value { color: #1a1a2e !important; }
  :root.light .kpi-sub { color: rgba(0,0,0,0.3) !important; }
  :root.light .an-section { background: #fff !important; border-color: rgba(0,0,0,0.08) !important; }
  :root.light .an-section-title { color: #1a1a2e !important; }
  :root.light .an-section-title span { color: rgba(0,0,0,0.35) !important; }
  :root.light .bar-label { color: rgba(0,0,0,0.5) !important; }
  :root.light .bar-track { background: rgba(0,0,0,0.06) !important; }
  :root.light .bar-qty { color: rgba(0,0,0,0.4) !important; }
  :root.light .value-row { background: rgba(0,0,0,0.03) !important; border-color: rgba(0,0,0,0.06) !important; }
  :root.light .value-name { color: rgba(0,0,0,0.5) !important; }
  :root.light .value-total-row { background: rgba(99,102,241,0.06) !important; border-color: rgba(99,102,241,0.15) !important; }
  :root.light .legend-item { color: rgba(0,0,0,0.4) !important; }
  :root.light .low-card { background: rgba(239,68,68,0.04) !important; }
  :root.light .low-brand { color: rgba(0,0,0,0.35) !important; }
  :root.light .low-type-badge { color: rgba(0,0,0,0.3) !important; }
  :root.light .all-good { color: rgba(0,0,0,0.3) !important; }
  :root.light .low-logo { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.07) !important; }
  :root.light .ai-panel { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .ai-msg.user { background: rgba(0,0,0,0.08); color: #1a1a2e; }
  :root.light .ai-msg.assistant { background: #f4f4f8; border-color: rgba(0,0,0,0.06); color: #333; }
  :root.light .ai-input { background: #f4f4f8; border-color: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .ai-send { background: rgba(0,0,0,0.1); }
  :root.light .ai-send:hover { background: rgba(0,0,0,0.2); }
  :root.light .ai-fab { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.12); }
  :root.light .ai-fab:hover { background: rgba(0,0,0,0.15); }
  :root.light .ai-header { background: rgba(0,0,0,0.02); }

  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes fadeMsg { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  .legend { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(255,255,255,0.35); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
`

const CAT_COLORS = [
  "#6366f1","#8b5cf6","#a78bfa","#818cf8",
  "#38bdf8","#34d399","#fbbf24","#f87171",
  "#c084fc","#60a5fa","#4ade80","#fb923c"
]

function ItemLogo({ item }) {
  const [imgError, setImgError] = React.useState(false)
  React.useEffect(() => { setImgError(false) }, [item.image_url, item.brand, item.name])
  const brandSlug = (item.brand || item.name || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  const logoUrl = brandSlug ? `https://logo.clearbit.com/${brandSlug}.com` : null
  const displayImg = item.image_url || logoUrl
  const initials = (item.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="low-logo">
      {displayImg && !imgError
        ? <img src={displayImg} alt={item.brand || item.name} onError={() => setImgError(true)} />
        : <div className="low-logo-initials">{initials}</div>
      }
    </div>
  )
}

// ── AI Agent ──────────────────────────────────────────────────────────────────
function AIAgent({ beverages, cleaners }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello! I'm your Analytics assistant. Ask me about inventory levels, low stock alerts, category trends, or purchase recommendations."
  }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const allItems = [...beverages, ...cleaners]
    const lowStock = allItems.filter(i => i.quantity <= i.min_stock)

    const catMap = {}
    allItems.forEach(i => {
      const cat = i.category || "Uncategorized"
      catMap[cat] = (catMap[cat] || 0) + i.quantity
    })
    const catSummary = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, qty]) => `  - ${cat}: ${qty} units`)
      .join("\n")

    const systemPrompt = `You are an AI Analytics assistant for GHM (Graydon Hall Manor), a luxury hotel.
You are embedded in the Analytics page of the inventory system.

INVENTORY SUMMARY:
- Total products: ${allItems.length} (${beverages.length} beverages, ${cleaners.length} cleaners)
- Total units in stock: ${allItems.reduce((s, i) => s + i.quantity, 0).toLocaleString()}
- Low stock alerts: ${lowStock.length}
- Categories: ${Object.keys(catMap).length}

BEVERAGES (${beverages.length}):
${beverages.map(b => `- ${b.name} (${b.brand || "N/A"}) | Qty: ${b.quantity} ${b.unit} | Cat: ${b.category || "N/A"} | Min: ${b.min_stock}`).join("\n") || "None"}

CLEANERS (${cleaners.length}):
${cleaners.map(c => `- ${c.name} (${c.brand || "N/A"}) | Qty: ${c.quantity} ${c.unit} | Cat: ${c.category || "N/A"} | Min: ${c.min_stock}`).join("\n") || "None"}

LOW STOCK ITEMS:
${lowStock.length > 0
  ? lowStock.map(i => `⚠️ ${i.name}: ${i.quantity} / min ${i.min_stock} ${i.unit}`).join("\n")
  : "✅ All items adequately stocked"}

STOCK BY CATEGORY:
${catSummary || "No category data"}

RULES:
- Only use the data above. Never invent numbers.
- Focus on actionable insights: what needs reorder, what is trending low, which category is most stocked.
- Be concise and professional.
- Respond in the user's language (English or Spanish).`

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.content?.[0]?.text || "Error processing request."
      }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen(v => !v)} title="Analytics Assistant">
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.5" strokeLinecap="round"/></svg>
        }
      </button>
      {open && (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-dot" />
            <div className="ai-header-title">Analytics Assistant</div>
            <span className="ai-header-sub">Claude</span>
            <button className="close-btn" onClick={() => setOpen(false)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="ai-typing"><span /><span /><span /></div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="ai-input-area">
            <input
              className="ai-input"
              placeholder="Ask about stock, trends, alerts..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button className="ai-send" onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Analytics({ token, role }) {
  const [beverages, setBeverages] = useState([])
  const [cleaners, setCleaners] = useState([])
  const [loading, setLoading] = useState(true)

  const canSeeBeverages = ['admin', 'beverage_manager', 'bartender'].includes(role)
  const canSeeCleaners  = ['admin', 'chef'].includes(role)

  useEffect(() => {
    if (!token) return
    const h = { Authorization: `Token ${token}`, "Content-Type": "application/json" }
    Promise.all([
      canSeeBeverages ? fetch(`${BASE}/beverages/`, { headers: h }).then(r => r.json()).catch(() => []) : Promise.resolve([]),
      canSeeCleaners  ? fetch(`${BASE}/cleaners/`,  { headers: h }).then(r => r.json()).catch(() => []) : Promise.resolve([]),
    ]).then(([b, c]) => {
      setBeverages(Array.isArray(b) ? b : [])
      setCleaners(Array.isArray(c) ? c : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [token, role])

  const allItems = [
    ...(canSeeBeverages ? beverages : []),
    ...(canSeeCleaners  ? cleaners  : []),
  ]
  const lowStock = allItems.filter(i => i.quantity <= i.min_stock)
  const totalItems = allItems.length
  const totalUnits = allItems.reduce((s, i) => s + i.quantity, 0)

  const catMap = {}
  allItems.forEach(i => {
    const cat = i.category || "Uncategorized"
    if (!catMap[cat]) catMap[cat] = 0
    catMap[cat] += i.quantity
  })
  const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1])
  const maxCat = catData[0]?.[1] || 1

  const bevValue = beverages.reduce((s, i) => s + i.quantity, 0)
  const clnValue = cleaners.reduce((s, i) => s + i.quantity, 0)

  if (loading) {
    return (
      <div className="an-root">
        <style>{STYLES}</style>
        <div className="an-loading"><div className="an-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="an-root">
      <style>{STYLES}</style>
      <div className="an-inner">

        <div className="an-header">
          <h1 className="an-title">Analytics</h1>
          <p className="an-subtitle">Real-time inventory overview · GHM Inventory System</p>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Products</div>
            <div className="kpi-value">{totalItems}</div>
            <div className="kpi-sub">
              {canSeeBeverages && `${beverages.length} bev`}
              {canSeeBeverages && canSeeCleaners && ' · '}
              {canSeeCleaners && `${cleaners.length} clean`}
            </div>
            <div className="kpi-icon">📦</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Total Units in Stock</div>
            <div className="kpi-value">{totalUnits.toLocaleString()}</div>
            <div className="kpi-sub">across all categories</div>
            <div className="kpi-icon">🗂</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Low Stock Alerts</div>
            <div className="kpi-value" style={{ color: lowStock.length > 0 ? "#f87171" : "#4ade80" }}>
              {lowStock.length}
            </div>
            <div className="kpi-sub">{lowStock.length === 0 ? "All items stocked ✓" : "items need reorder"}</div>
            <div className="kpi-icon">⚠️</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Categories</div>
            <div className="kpi-value">{catData.length}</div>
            <div className="kpi-sub">unique product types</div>
            <div className="kpi-icon">🏷</div>
          </div>
        </div>

        <div className="an-section">
          <div className="an-section-title">
            ⚠️ Low Stock Alerts
            <span>{lowStock.length} item{lowStock.length !== 1 ? "s" : ""} below minimum</span>
          </div>
          {lowStock.length === 0 ? (
            <div className="all-good">
              <div className="all-good-icon">✅</div>
              <div>All products are adequately stocked</div>
            </div>
          ) : (
            <div className="low-grid">
              {lowStock.map((item, i) => {
                const pct = Math.min((item.quantity / item.min_stock) * 100, 100)
                const isBev = beverages.some(b => b.id === item.id)
                return (
                  <div key={item.id} className="low-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="low-card-top">
                      <div className="low-card-top-left">
                        <div className="low-type-badge">{isBev ? "Beverage" : "Cleaner"}</div>
                        <div className="low-name">{item.name}</div>
                      </div>
                      <ItemLogo item={item} />
                    </div>
                    <div className="low-brand">{item.brand || "—"}</div>
                    <div className="low-progress">
                      <div className="low-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="low-numbers">
                      <span className="low-current">{item.quantity} {item.unit}</span>
                      <span className="low-min">min: {item.min_stock}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="an-two-col">
          <div className="an-section" style={{ marginBottom: 0 }}>
            <div className="an-section-title">
              📊 Stock by Category
              <span>{catData.length} categories</span>
            </div>
            <div className="bar-chart">
              {catData.map(([cat, qty], i) => (
                <div key={cat} className="bar-row">
                  <div className="bar-label" title={cat}>{cat}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      "--target-width": `${(qty / maxCat) * 100}%`,
                      "--bar-color": CAT_COLORS[i % CAT_COLORS.length],
                      "--delay": `${i * 0.06}s`
                    }} />
                  </div>
                  <div className="bar-qty">{qty}</div>
                </div>
              ))}
              {catData.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No data available.</p>
              )}
            </div>
          </div>

          <div className="an-section" style={{ marginBottom: 0 }}>
            <div className="an-section-title">
              💼 Inventory Value
              <span>units as stock proxy</span>
            </div>
            <div className="value-list">
              {canSeeBeverages && (
                <div className="value-row">
                  <span className="value-name">🍷 Beverages</span>
                  <span className="value-amount">{bevValue.toLocaleString()} units</span>
                </div>
              )}
              {canSeeCleaners && (
                <div className="value-row">
                  <span className="value-name">🧹 Cleaners</span>
                  <span className="value-amount">{clnValue.toLocaleString()} units</span>
                </div>
              )}
              <div className="value-row">
                <span className="value-name">📦 Products with stock</span>
                <span className="value-amount">{allItems.filter(i => i.quantity > 0).length} / {totalItems}</span>
              </div>
              <div className="value-row">
                <span className="value-name">🚨 Out of stock</span>
                <span className="value-amount" style={{ color: allItems.filter(i => i.quantity === 0).length > 0 ? "#f87171" : "#4ade80" }}>
                  {allItems.filter(i => i.quantity === 0).length} items
                </span>
              </div>
              <div className="value-total-row">
                <span className="value-total-label">Total Units in Inventory</span>
                <span className="value-total-amount">{totalUnits.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div className="legend">
                {canSeeBeverages && (
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#6366f1" }} />
                    Beverages {totalUnits > 0 ? Math.round((bevValue / totalUnits) * 100) : 0}%
                  </div>
                )}
                {canSeeCleaners && (
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#34d399" }} />
                    Cleaners {totalUnits > 0 ? Math.round((clnValue / totalUnits) * 100) : 0}%
                  </div>
                )}
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "5px", overflow: "hidden", display: "flex" }}>
                <div style={{
                  width: `${totalUnits > 0 ? (bevValue / totalUnits) * 100 : 50}%`,
                  background: "linear-gradient(90deg, #4f46e5, #6366f1)",
                  transition: "width 1s ease"
                }} />
                <div style={{ flex: 1, background: "linear-gradient(90deg, #34d399, #10b981)", transition: "width 1s ease" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Agent - same position as Dashboard */}
      <AIAgent beverages={beverages} cleaners={cleaners} />
    </div>
  )
}