import React, { useState, useEffect, useRef } from "react"

const BASE = "http://127.0.0.1:8000/api"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

  .pt-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #0d0d0d; color: #e0e0e0; padding-top: 88px; }
  .pt-inner { max-width: 1100px; margin: 0 auto; padding: 32px 24px 80px; }

  .pt-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
  .pt-title { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
  .pt-subtitle { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 4px; }

  .btn-primary { display:flex; align-items:center; gap:6px; padding:9px 18px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:background .2s; }
  .btn-primary:hover { background:rgba(255,255,255,0.2); }
  .btn-danger { padding:7px 14px; border-radius:7px; border:1px solid rgba(239,68,68,0.2); background:transparent; color:#f87171; font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; transition:all .2s; }
  .btn-danger:hover { background:rgba(239,68,68,0.1); }
  .btn-secondary { padding: 9px 18px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; }

  .party-list { display: flex; flex-direction: column; gap: 20px; }
  .party-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; transition: border-color .2s; opacity: 0; transform: translateY(10px); animation: fadeUp .4s ease forwards; }
  .party-card:hover { border-color: rgba(255,255,255,0.15); }
  .party-card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; cursor: pointer; background: rgba(255,255,255,0.01); border-bottom: 1px solid rgba(255,255,255,0.05); gap: 16px; flex-wrap: wrap; }
  .party-card-header:hover { background: rgba(255,255,255,0.03); }
  .party-info { display: flex; flex-direction: column; gap: 3px; }
  .party-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600; color: #fff; }
  .party-date { font-size: 12px; color: rgba(255,255,255,0.3); }
  .party-notes-preview { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 2px; font-style: italic; }
  .party-stats { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
  .party-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .party-stat-val { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #e0e0e0; line-height: 1; }
  .party-stat-val.green { color: #4ade80; }
  .party-stat-label { font-size: 10px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: .08em; }
  .party-chevron { color: rgba(255,255,255,0.2); transition: transform .25s; }
  .party-chevron.open { transform: rotate(180deg); }
  .party-actions { display: flex; gap: 8px; }

  .party-body { padding: 20px 22px; }
  .party-body-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
  .party-body-label { font-size: 11px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: .1em; }

  .bottles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
  .bottle-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px; padding-bottom: 36px; position: relative; transition: border-color .2s; }
  .bottle-card:hover { border-color: rgba(255,255,255,0.15); }
  .bottle-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .bottle-logo { display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); overflow: hidden; flex-shrink: 0; }
  .bottle-logo img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
  .bottle-logo-initials { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.2); }
  .bottle-delete { position: absolute; bottom: 8px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.15); cursor: pointer; padding: 4px; transition: color .2s; line-height: 1; border-radius: 4px; }
  .bottle-delete:hover { color: #f87171; background: rgba(239,68,68,0.08); }
  .bottle-name { font-size: 13px; font-weight: 500; color: #f0f0f0; margin-bottom: 2px; }
  .bottle-brand { font-size: 11px; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
  .bottle-price { font-size: 15px; font-weight: 600; color: #e0e0e0; font-variant-numeric: tabular-nums; margin-bottom: 6px; }
  .bottle-meta { display: flex; flex-direction: column; gap: 3px; }
  .bottle-meta-row { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.3); }
  .bottle-notes { font-size: 11px; color: rgba(255,255,255,0.2); font-style: italic; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px; }

  .no-bottles { display: flex; flex-direction: column; align-items: center; padding: 30px; gap: 8px; color: rgba(255,255,255,0.2); font-size: 13px; }
  .no-bottles-icon { font-size: 28px; }

  .pt-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; gap: 14px; color: rgba(255,255,255,0.2); }
  .pt-empty-icon { font-size: 48px; }
  .pt-empty-text { font-size: 14px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn .2s ease; }
  .modal-box { background: #111117; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 28px; width: 460px; max-width: 95vw; animation: slideUp .25s cubic-bezier(0.34,1.56,0.64,1); max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 600; color: #f0f0f0; margin-bottom: 22px; }
  .modal-field { margin-bottom: 14px; }
  .modal-label { display: block; font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
  .modal-input { width: 100%; padding: 10px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; color: #e0e0e0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; box-sizing: border-box; }
  .modal-input:focus { border-color: rgba(255,255,255,0.3); }
  .modal-textarea { resize: vertical; min-height: 70px; }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 22px; }

  .bev-picker { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; max-height: 200px; overflow-y: auto; margin-top: 8px; padding: 2px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
  .bev-option { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); cursor: pointer; transition: all .2s; text-align: center; }
  .bev-option:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
  .bev-option.selected { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1); }
  .bev-option-logo { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(255,255,255,0.05); overflow: hidden; }
  .bev-option-logo img { width: 100%; height: 100%; object-fit: contain; padding: 2px; }
  .bev-option-initials { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.2); }
  .bev-option-name { font-size: 11px; color: rgba(255,255,255,0.6); line-height: 1.2; }
  .bev-option.selected .bev-option-name { color: #fff; }

  .pt-spinner { display: flex; justify-content: center; padding: 80px; opacity: .4; }
  .pt-spinner-inner { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.1); border-top-color: rgba(255,255,255,0.6); border-radius: 50%; animation: spin .8s linear infinite; }

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

  :root.light .pt-root { background: #f4f4f8; color: #1a1a2e; }
  :root.light .pt-title { color: #1a1a2e; }
  :root.light .party-card { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .party-card-header { background: rgba(0,0,0,0.01); border-color: rgba(0,0,0,0.06); }
  :root.light .party-name { color: #1a1a2e; }
  :root.light .party-date { color: rgba(0,0,0,0.35); }
  :root.light .bottle-card { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .bottle-name { color: #1a1a2e; }
  :root.light .bottle-brand { color: rgba(0,0,0,0.4); }
  :root.light .modal-box { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .modal-title { color: #1a1a2e; }
  :root.light .modal-input { background: #f8f8fc; border-color: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .btn-primary { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.12); color: #1a1a2e; }
  :root.light .btn-primary:hover { background: rgba(0,0,0,0.15); }
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
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeMsg { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
`

function BottleLogo({ name, brand, image_url, size = 38 }) {
  const [err, setErr] = useState(false)
  useEffect(() => setErr(false), [image_url, brand, name])
  const slug = (brand || name || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  const src = image_url || (slug ? `https://logo.clearbit.com/${slug}.com` : null)
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="bottle-logo" style={{ width: size, height: size }}>
      {src && !err
        ? <img src={src} alt={brand || name} onError={() => setErr(true)} />
        : <div className="bottle-logo-initials">{initials}</div>
      }
    </div>
  )
}

function PartyModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", date: new Date().toISOString().slice(0, 10), notes: "" })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">🎉 New Party / Event</div>
        <div className="modal-field">
          <label className="modal-label">Event Name *</label>
          <input className="modal-input" placeholder="e.g. New Year's Eve 2025" value={form.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Date *</label>
          <input className="modal-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Notes</label>
          <textarea className="modal-input modal-textarea" placeholder="Private event, rooftop..." value={form.notes} onChange={e => set("notes", e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { if (form.name.trim() && form.date) { onSave(form); onClose() } }}>
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}

function BottleModal({ onClose, onSave, beverages }) {
  const [selectedBevId, setSelectedBevId] = useState(null)
  const [form, setForm] = useState({ name: "", brand: "", image_url: "", price_per_unit: "", opened_by: "", notes: "" })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const pickBev = (bev) => {
    if (selectedBevId === bev.id) {
      setSelectedBevId(null)
      setForm(f => ({ ...f, name: "", brand: "", image_url: "" }))
    } else {
      setSelectedBevId(bev.id)
      setForm(f => ({ ...f, name: bev.name, brand: bev.brand || "", image_url: bev.image_url || "" }))
    }
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    onSave({
      beverage: selectedBevId || null,
      name: form.name, brand: form.brand, image_url: form.image_url,
      price_per_unit: parseFloat(form.price_per_unit) || 0,
      opened_by: form.opened_by, notes: form.notes,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">🍾 Register Opened Bottle</div>
        {beverages.length > 0 && (
          <div className="modal-field">
            <label className="modal-label">Pick from inventory (optional)</label>
            <div className="bev-picker">
              {beverages.map(bev => {
                const slug = (bev.brand || bev.name || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
                const src = bev.image_url || (slug ? `https://logo.clearbit.com/${slug}.com` : null)
                return (
                  <div key={`bev-${bev.id}`} className={`bev-option ${selectedBevId === bev.id ? "selected" : ""}`} onClick={() => pickBev(bev)}>
                    <div className="bev-option-logo">
                      {src ? <img src={src} alt={bev.name} onError={e => { e.target.style.display = "none" }} /> : <div className="bev-option-initials">{(bev.name || "?")[0].toUpperCase()}</div>}
                    </div>
                    <div className="bev-option-name">{bev.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Name *</label>
            <input className="modal-input" placeholder="e.g. Johnnie Walker" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Brand</label>
            <input className="modal-input" placeholder="e.g. Diageo" value={form.brand} onChange={e => set("brand", e.target.value)} />
          </div>
        </div>
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Price per bottle ($)</label>
            <input className="modal-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price_per_unit} onChange={e => set("price_per_unit", e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Opened by</label>
            <input className="modal-input" placeholder="Staff name..." value={form.opened_by} onChange={e => set("opened_by", e.target.value)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Image URL</label>
          <input className="modal-input" placeholder="https://..." value={form.image_url} onChange={e => set("image_url", e.target.value)} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Notes</label>
          <textarea className="modal-input modal-textarea" placeholder="Table 5, special request..." value={form.notes} onChange={e => set("notes", e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Add Bottle</button>
        </div>
      </div>
    </div>
  )
}

// ── AI Agent ──────────────────────────────────────────────────────────────────
function AIAgent({ parties }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello! I'm your Event assistant. Ask me about party consumption, bottle usage, costs per event, or which event had the highest beverage spend."
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

    // Build party summary for the prompt
    const partySummary = parties.map(p => {
      const bottles = p.opened_bottles || []
      const totalCost = bottles.reduce((s, b) => s + parseFloat(b.price_per_unit || 0), 0)
      const bottleNames = bottles.map(b => `${b.name}${b.brand ? ` (${b.brand})` : ""}$${parseFloat(b.price_per_unit || 0).toFixed(2)}${b.opened_by ? ` by ${b.opened_by}` : ""}`).join(", ")
      return `- Event: "${p.name}" | Date: ${p.date} | Bottles: ${bottles.length} | Total Cost: $${totalCost.toFixed(2)}${bottles.length > 0 ? ` | Items: ${bottleNames}` : ""}`
    }).join("\n")

    const totalBottles = parties.reduce((s, p) => s + (p.opened_bottles?.length || 0), 0)
    const totalCost    = parties.reduce((s, p) => s + (p.opened_bottles || []).reduce((ss, b) => ss + parseFloat(b.price_per_unit || 0), 0), 0)
    const topParty     = [...parties].sort((a, b) => (b.opened_bottles?.length || 0) - (a.opened_bottles?.length || 0))[0]
    const topCostParty = [...parties].sort((a, b) => {
      const ca = (a.opened_bottles || []).reduce((s, bt) => s + parseFloat(bt.price_per_unit || 0), 0)
      const cb = (b.opened_bottles || []).reduce((s, bt) => s + parseFloat(bt.price_per_unit || 0), 0)
      return cb - ca
    })[0]

    const systemPrompt = `You are an AI Event & Beverage assistant for GHM (Graydon Hall Manor), a luxury hotel.
You are embedded in the Event Tracker page of the inventory system.

EVENTS OVERVIEW:
- Total events: ${parties.length}
- Total bottles opened across all events: ${totalBottles}
- Total beverage cost across all events: $${totalCost.toFixed(2)}
- Highest bottle count event: ${topParty ? `"${topParty.name}" (${topParty.opened_bottles?.length || 0} bottles)` : "N/A"}
- Highest cost event: ${topCostParty ? `"${topCostParty.name}" ($${((topCostParty.opened_bottles || []).reduce((s, b) => s + parseFloat(b.price_per_unit || 0), 0)).toFixed(2)})` : "N/A"}

EVENTS DETAIL:
${partySummary || "No events registered yet."}

RULES:
- Only use the data above. Never invent numbers.
- Focus on actionable insights: which event consumed most, cost breakdown, bottle usage patterns.
- If asked about waste or efficiency, compare bottle counts and costs across events.
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
      <button className="ai-fab" onClick={() => setOpen(v => !v)} title="Event Assistant">
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.5" strokeLinecap="round"/></svg>
        }
      </button>
      {open && (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-dot" />
            <div className="ai-header-title">Event Assistant</div>
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
              placeholder="Ask about events, bottles, costs..."
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

export default function Parties({ token, activeTab }) {
  const [parties, setParties] = useState([])
  const [beverages, setBeverages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [showPartyModal, setShowPartyModal] = useState(false)
  const [bottleModal, setBottleModal] = useState(null)

  const headersRef = useRef({ Authorization: `Token ${token}`, "Content-Type": "application/json" })

  useEffect(() => {
    if (!token || activeTab !== "parties") return
    const headers = headersRef.current
    setLoading(true); setError(null)
    Promise.all([
      fetch(`${BASE}/parties/`, { headers }).then(r => { if (!r.ok) throw new Error(`parties: ${r.status}`); return r.json() }),
      fetch(`${BASE}/beverages/`, { headers }).then(r => { if (!r.ok) throw new Error(`beverages: ${r.status}`); return r.json() }),
    ]).then(([p, b]) => {
      setParties(Array.isArray(p) ? p : [])
      setBeverages(Array.isArray(b) ? b : [])
      setLoading(false)
    }).catch(err => { setError(err.message); setLoading(false) })
  }, [token, activeTab])

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  const createParty = async (data) => {
    const res = await fetch(`${BASE}/parties/`, { method: "POST", headers: headersRef.current, body: JSON.stringify(data) })
    const json = await res.json()
    if (json?.id) { setParties(prev => [{ ...json, opened_bottles: [] }, ...prev]); setExpanded(e => ({ ...e, [json.id]: true })) }
  }

  const deleteParty = async (id) => {
    if (!window.confirm("Delete this event and all its bottles?")) return
    await fetch(`${BASE}/parties/${id}/`, { method: "DELETE", headers: headersRef.current })
    setParties(prev => prev.filter(p => p.id !== id))
  }

  const addBottle = async (partyId, data) => {
    const res = await fetch(`${BASE}/parties/${partyId}/bottles/`, { method: "POST", headers: headersRef.current, body: JSON.stringify(data) })
    const json = await res.json()
    if (json?.id) setParties(prev => prev.map(p => p.id === partyId ? { ...p, opened_bottles: [json, ...(p.opened_bottles || [])] } : p))
  }

  const deleteBottle = async (partyId, bottleId, bottleName) => {
    if (!window.confirm(`Delete "${bottleName}" from this event?`)) return
    await fetch(`${BASE}/parties/${partyId}/bottles/${bottleId}/`, { method: "DELETE", headers: headersRef.current })
    setParties(prev => prev.map(p => p.id === partyId ? { ...p, opened_bottles: (p.opened_bottles || []).filter(b => b.id !== bottleId) } : p))
  }

  if (activeTab !== "parties") return null

  return (
    <div className="pt-root">
      <style>{STYLES}</style>
      <div className="pt-inner">
        <div className="pt-header">
          <div>
            <div className="pt-title">Event Tracker</div>
            <div className="pt-subtitle">Track opened bottles per event · GHM Inventory System</div>
          </div>
          <button className="btn-primary" onClick={() => setShowPartyModal(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Event
          </button>
        </div>

        {loading && <div className="pt-spinner"><div className="pt-spinner-inner" /></div>}
        {error && <div style={{ textAlign:"center", padding:"40px", color:"#f87171", fontSize:"13px" }}>⚠️ Error: {error}</div>}

        {!loading && !error && parties.length === 0 && (
          <div className="pt-empty">
            <div className="pt-empty-icon">🍾</div>
            <div className="pt-empty-text">No events yet — create your first one</div>
            <button className="btn-primary" onClick={() => setShowPartyModal(true)}>Create Event</button>
          </div>
        )}

        {!loading && !error && parties.length > 0 && (
          <div className="party-list">
            {parties.map((party, idx) => {
              const bottles = party.opened_bottles || []
              const totalCost = bottles.reduce((s, b) => s + parseFloat(b.price_per_unit || 0), 0)
              const isOpen = !!expanded[party.id]
              return (
                <div key={`party-${party.id}`} className="party-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className="party-card-header" onClick={() => toggleExpand(party.id)}>
                    <div className="party-info">
                      <div className="party-name">{party.name}</div>
                      <div className="party-date">📅 {new Date(party.date + "T12:00:00").toLocaleDateString("en-US", { weekday:"short", year:"numeric", month:"long", day:"numeric" })}</div>
                      {party.notes && <div className="party-notes-preview">{party.notes}</div>}
                    </div>
                    <div className="party-stats">
                      <div className="party-stat">
                        <div className="party-stat-val">{bottles.length}</div>
                        <div className="party-stat-label">Bottles</div>
                      </div>
                      <div className="party-stat">
                        <div className="party-stat-val green">${totalCost.toFixed(2)}</div>
                        <div className="party-stat-label">Total Cost</div>
                      </div>
                      <div className="party-actions" onClick={e => e.stopPropagation()}>
                        <button className="btn-danger" onClick={() => deleteParty(party.id)}>Delete</button>
                      </div>
                      <svg className={`party-chevron ${isOpen ? "open" : ""}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="party-body">
                      <div className="party-body-top">
                        <span className="party-body-label">{bottles.length} bottle{bottles.length !== 1 ? "s" : ""} opened</span>
                        <button className="btn-primary" style={{ padding:"6px 14px", fontSize:"12px" }} onClick={() => setBottleModal(party.id)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add Bottle
                        </button>
                      </div>
                      {bottles.length === 0 ? (
                        <div className="no-bottles"><div className="no-bottles-icon">🍾</div><div>No bottles registered yet</div></div>
                      ) : (
                        <div className="bottles-grid">
                          {bottles.map(bottle => (
                            <div key={`bottle-${bottle.id}`} className="bottle-card">
                              <div className="bottle-card-top">
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div className="bottle-name">{bottle.name}</div>
                                  <div className="bottle-brand">{bottle.brand || "—"}</div>
                                </div>
                                <BottleLogo name={bottle.name} brand={bottle.brand} image_url={bottle.image_url} size={38} />
                              </div>
                              <div className="bottle-price">${parseFloat(bottle.price_per_unit || 0).toFixed(2)}</div>
                              <div className="bottle-meta">
                                {bottle.opened_by && <div className="bottle-meta-row"><span>👤</span> {bottle.opened_by}</div>}
                                <div className="bottle-meta-row"><span>🕐</span> {new Date(bottle.opened_at).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" })}</div>
                              </div>
                              {bottle.notes && <div className="bottle-notes">{bottle.notes}</div>}
                              <button className="bottle-delete" onClick={() => deleteBottle(party.id, bottle.id, bottle.name)} title="Delete bottle">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  <path d="M10 11v6"/><path d="M14 11v6"/>
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showPartyModal && <PartyModal onClose={() => setShowPartyModal(false)} onSave={createParty} />}
      {bottleModal !== null && (
        <BottleModal onClose={() => setBottleModal(null)} onSave={(data) => addBottle(bottleModal, data)} beverages={beverages} />
      )}

      {/* AI Agent - same position as Dashboard */}
      <AIAgent parties={parties} />
    </div>
  )
}