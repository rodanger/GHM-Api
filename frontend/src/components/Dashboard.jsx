import React, { useState, useEffect, useRef } from "react"

const BASE = "http://127.0.0.1:8000/api"
const headers = (token) => ({ Authorization: `Token ${token}`, "Content-Type": "application/json" })

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
  .ghm-db { font-family: 'DM Sans', sans-serif; }
  .search-container { display:flex; gap:10px; align-items:center; margin-bottom:28px; flex-wrap:wrap; }
  .search-wrapper { position:relative; flex:1; min-width:200px; }
  .search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3); pointer-events:none; }
  .search-input { width:100%; padding:10px 14px 10px 40px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#e0e0e0; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color .2s; }
  .search-input:focus { border-color:rgba(255,255,255,0.3); }
  .search-input::placeholder { color:rgba(255,255,255,0.2); }
  .type-toggle { display:flex; gap:4px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:4px; }
  .type-btn { padding:6px 14px; border-radius:6px; border:none; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; cursor:pointer; transition:all .2s; color:rgba(255,255,255,0.4); background:transparent; }
  .type-btn.active { background:rgba(255,255,255,0.15); color:#fff; }
  .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .section-label { font-size:11px; color:rgba(255,255,255,0.3); letter-spacing:.1em; text-transform:uppercase; }
  .add-btn { display:flex; align-items:center; gap:6px; padding:6px 14px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; cursor:pointer; transition:background .2s; }
  .add-btn:hover { background:rgba(255,255,255,0.2); }
  .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:16px; transition:border-color .2s, box-shadow .2s; position:relative; }
  .card:hover { border-color:rgba(255,255,255,0.2); box-shadow:0 4px 20px rgba(0,0,0,0.3); }
  .card-name { font-size:15px; font-weight:500; color:#f0f0f0; margin-bottom:2px; }
  .card-brand { font-size:12px; color:rgba(255,255,255,0.35); margin-bottom:8px; }
  .card-qty { font-size:13px; color:#c0c0c0; }
  .card-cat { font-size:11px; color:rgba(255,255,255,0.4); margin-top:4px; }
  .low-badge { font-size:10px; background:rgba(239,68,68,0.15); color:#fca5a5; padding:2px 8px; border-radius:20px; border:1px solid rgba(239,68,68,0.25); }
  .stock-badge { font-size:10px; background:rgba(74,222,128,0.12); color:#86efac; padding:2px 8px; border-radius:20px; border:1px solid rgba(74,222,128,0.25); }
  .card-actions { display:flex; gap:6px; margin-top:12px; }
  .btn-edit { padding:5px 12px; border-radius:5px; border:1px solid rgba(255,255,255,0.15); background:transparent; color:rgba(255,255,255,0.6); font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; transition:all .2s; }
  .btn-edit:hover { background:rgba(255,255,255,0.1); color:#fff; }
  .btn-delete { padding:5px 12px; border-radius:5px; border:1px solid rgba(239,68,68,0.2); background:transparent; color:#f87171; font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; transition:all .2s; }
  .btn-delete:hover { background:rgba(239,68,68,0.1); }
  .inline-field { width:100%; padding:7px 10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#e0e0e0; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; margin-bottom:6px; transition:border-color .2s; }
  .inline-field:focus { border-color:rgba(255,255,255,0.3); }
  .inline-actions { display:flex; gap:6px; margin-top:4px; }
  .btn-save { padding:5px 14px; border-radius:5px; border:none; background:rgba(255,255,255,0.15); color:#fff; font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; }
  .btn-save:hover { background:rgba(255,255,255,0.25); }
  .btn-cancel { padding:5px 12px; border-radius:5px; border:1px solid rgba(255,255,255,0.1); background:transparent; color:rgba(255,255,255,0.4); font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; animation:fadeIn .2s ease; }
  .modal-box { background:#111117; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:28px; width:440px; max-width:95vw; animation:slideUp .25s cubic-bezier(0.34,1.56,0.64,1); }
  .modal-title { font-size:17px; font-weight:500; color:#f0f0f0; margin-bottom:20px; }
  .modal-field { margin-bottom:14px; }
  .modal-label { display:block; font-size:11px; color:rgba(255,255,255,0.35); letter-spacing:.1em; text-transform:uppercase; margin-bottom:6px; }
  .modal-input { width:100%; padding:10px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:7px; color:#e0e0e0; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color .2s; box-sizing:border-box; }
  .modal-input:focus { border-color:rgba(255,255,255,0.3); }
  .modal-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .modal-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; }
  .btn-primary { padding:9px 22px; border-radius:7px; border:none; background:rgba(255,255,255,0.15); color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:background .2s; }
  .btn-primary:hover { background:rgba(255,255,255,0.25); }
  .btn-secondary { padding:9px 18px; border-radius:7px; border:1px solid rgba(255,255,255,0.1); background:transparent; color:rgba(255,255,255,0.4); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }
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
  .card-logo { width:64px; height:64px; display:flex; align-items:center; justify-content:center; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.06); overflow:hidden; flex-shrink:0; }
  .card-logo img { width:100%; height:100%; object-fit:contain; padding:4px; }
  .card-logo-initials { font-size:15px; font-weight:600; color:rgba(255,255,255,0.2); letter-spacing:0.05em; }
  :root.light .ghm-db { color: #1a1a2e; }
  :root.light .min-h-screen { background: #f4f4f8 !important; }
  :root.light .card { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .card:hover { border-color: rgba(0,0,0,0.2); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  :root.light .card-name { color: #1a1a2e; }
  :root.light .card-brand { color: rgba(0,0,0,0.4); }
  :root.light .card-qty { color: #444; }
  :root.light .card-cat { color: rgba(0,0,0,0.4); }
  :root.light .search-input { background: #fff; border-color: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .search-input::placeholder { color: rgba(0,0,0,0.3); }
  :root.light .search-icon { color: rgba(0,0,0,0.3); }
  :root.light .type-toggle { background: #fff; border-color: rgba(0,0,0,0.1); }
  :root.light .type-btn { color: rgba(0,0,0,0.4); }
  :root.light .type-btn.active { background: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .section-label { color: rgba(0,0,0,0.35); }
  :root.light .add-btn { background:  rgba(255,255,255,0.12); border-color: rgba(0,0,0,0.12); color: #1a1a2e; }
  :root.light .add-btn:hover { background: rgba(0,0,0,0.15); }
  :root.light .btn-edit { border-color: rgba(0,0,0,0.15); color: rgba(0,0,0,0.6); }
  :root.light .btn-edit:hover { background: rgba(0,0,0,0.06); color: #1a1a2e; }
  :root.light .inline-field { background: #f8f8fc; border-color: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .btn-save { background: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .btn-save:hover { background: rgba(0,0,0,0.2); }
  :root.light .modal-box { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .modal-title { color: #1a1a2e; }
  :root.light .modal-label { color: rgba(0,0,0,0.4); }
  :root.light .modal-input { background: #f8f8fc; border-color: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .btn-primary { background: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .btn-primary:hover { background: rgba(0,0,0,0.2); }
  :root.light .ai-panel { background: #fff; border-color: rgba(0,0,0,0.08); }
  :root.light .ai-msg.user { background: rgba(0,0,0,0.08); color: #1a1a2e; }
  :root.light .ai-msg.assistant { background: #f4f4f8; border-color: rgba(0,0,0,0.06); color: #333; }
  :root.light .ai-input { background: #f4f4f8; border-color: rgba(0,0,0,0.1); color: #1a1a2e; }
  :root.light .ai-send { background: rgba(0,0,0,0.1); }
  :root.light .ai-send:hover { background: rgba(0,0,0,0.2); }
  :root.light .ai-fab { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.12); }
  :root.light .ai-fab:hover { background: rgba(0,0,0,0.15); }
  :root.light .ai-header { background: rgba(0,0,0,0.02); }
  :root.light .card-logo { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.06); }
  :root.light h1 { color: #1a1a2e !important; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes fadeMsg { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
`

const EMPTY = { name: "", brand: "", quantity: 0, unit: "", category: "", min_stock: 10, image_url: "" }

function CreateModal({ type, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="modal-title">Add {type === "beverage" ? "Beverage" : "Cleaner"}</h2>
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Name *</label>
            <input className="modal-input" placeholder="e.g. Smirnoff" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Brand</label>
            <input className="modal-input" placeholder="e.g. Diageo" value={form.brand} onChange={e => set("brand", e.target.value)} />
          </div>
        </div>
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Quantity *</label>
            <input className="modal-input" type="number" min="0" value={form.quantity} onChange={e => set("quantity", parseInt(e.target.value) || 0)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Unit</label>
            <input className="modal-input" placeholder="bottles, liters..." value={form.unit} onChange={e => set("unit", e.target.value)} />
          </div>
        </div>
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Category</label>
            <input className="modal-input" placeholder="Vodka, Whisky..." value={form.category} onChange={e => set("category", e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Min Stock</label>
            <input className="modal-input" type="number" min="0" value={form.min_stock} onChange={e => set("min_stock", parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">Image URL</label>
          <input className="modal-input" placeholder="https://..." value={form.image_url} onChange={e => set("image_url", e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { if (form.name.trim()) { onSave(form); onClose() } }}>
            Add {type === "beverage" ? "Beverage" : "Cleaner"}
          </button>
        </div>
      </div>
    </div>
  )
}

function ItemCard({ item, onSave, onDelete, canEdit = true }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(item)
  const [imgError, setImgError] = useState(false)

  useEffect(() => { setImgError(false) }, [item.image_url, item.brand, item.name])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSave = () => { onSave(item.id, form); setEditing(false) }
  const handleCancel = () => { setForm(item); setEditing(false) }
  const isLow = item.quantity <= item.min_stock

  const brandSlug = (item.brand || item.name || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  const logoUrl = brandSlug ? `https://logo.clearbit.com/${brandSlug}.com` : null
  const initials = (item.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const displayImg = item.image_url || logoUrl

  if (editing) {
    return (
      <div className="card">
        <input className="inline-field" placeholder="Name" value={form.name} onChange={e => set("name", e.target.value)} />
        <input className="inline-field" placeholder="Brand" value={form.brand || ""} onChange={e => set("brand", e.target.value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          <input className="inline-field" type="number" placeholder="Quantity" value={form.quantity} onChange={e => set("quantity", parseInt(e.target.value) || 0)} style={{ marginBottom: 0 }} />
          <input className="inline-field" placeholder="Unit" value={form.unit || ""} onChange={e => set("unit", e.target.value)} style={{ marginBottom: 0 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "6px" }}>
          <input className="inline-field" placeholder="Category" value={form.category || ""} onChange={e => set("category", e.target.value)} style={{ marginBottom: 0 }} />
          <input className="inline-field" type="number" placeholder="Min Stock" value={form.min_stock} onChange={e => set("min_stock", parseInt(e.target.value) || 0)} style={{ marginBottom: 0 }} />
        </div>
        <input className="inline-field" placeholder="Image URL (https://...)" value={form.image_url || ""} onChange={e => set("image_url", e.target.value)} style={{ marginTop: "6px" }} />
        <div className="inline-actions">
          <button className="btn-save" onClick={handleSave}>Save</button>
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="card-name">{item.name}</div>
          {isLow
            ? <span className="low-badge">Low Stock</span>
            : <span className="stock-badge">In Stock</span>
          }
        </div>
        <div className="card-logo">
          {displayImg && !imgError ? (
            <img src={displayImg} alt={item.brand || item.name} onError={() => setImgError(true)} />
          ) : (
            <div className="card-logo-initials">{initials}</div>
          )}
        </div>
      </div>
      <div className="card-brand">{item.brand || "—"}</div>
      <div className="card-qty">{item.quantity} {item.unit}</div>
      {item.category && <div className="card-cat">{item.category}</div>}
      {canEdit && (
        <div className="card-actions">
          <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>
          <button className="btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}

function AIAgent({ token, beverages, cleaners }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! I'm your GHM inventory assistant. Ask me about stock levels, low items, or purchase recommendations." }])
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

    const systemPrompt = `You are an inventory assistant for GHM (Graydon Hall Manor), a luxury hotel.
BEVERAGES (${beverages.length}):
${beverages.map(b => `- ${b.name} (${b.brand||"N/A"}) | Qty: ${b.quantity} ${b.unit} | Cat: ${b.category||"N/A"} | Min: ${b.min_stock}`).join("\n") || "None"}
CLEANERS (${cleaners.length}):
${cleaners.map(c => `- ${c.name} (${c.brand||"N/A"}) | Qty: ${c.quantity} ${c.unit} | Cat: ${c.category||"N/A"} | Min: ${c.min_stock}`).join("\n") || "None"}
LOW STOCK:
${[...beverages.filter(b=>b.quantity<=b.min_stock).map(b=>`⚠️ ${b.name}: ${b.quantity}/${b.min_stock}`),
   ...cleaners.filter(c=>c.quantity<=c.min_stock).map(c=>`⚠️ ${c.name}: ${c.quantity}/${c.min_stock}`)
].join("\n") || "✅ All stocked"}
Be concise. Respond in the user's language (English or Spanish).`

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Error processing request." }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen(v => !v)} title="AI Assistant">
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.5" strokeLinecap="round"/></svg>
        }
      </button>
      {open && (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-dot" />
            <div className="ai-header-title">Inventory Assistant</div>
            <span className="ai-header-sub">Claude</span>
            <button className="close-btn" onClick={() => setOpen(false)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="ai-messages">
            {messages.map((m, i) => <div key={i} className={`ai-msg ${m.role}`}>{m.content}</div>)}
            {loading && <div className="ai-typing"><span/><span/><span/></div>}
            <div ref={bottomRef} />
          </div>
          <div className="ai-input-area">
            <input className="ai-input" placeholder="Ask about stock..." value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} disabled={loading} />
            <button className="ai-send" onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Dashboard({ token, role, activeTab }) {
  const [beverages, setBeverages] = useState([])
  const [cleaners, setCleaners] = useState([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(false)

  const h = headers(token)

  const canSeeBeverages  = ['admin', 'beverage_manager', 'bartender'].includes(role)
  const canEditBeverages = ['admin', 'beverage_manager'].includes(role)
  const canSeeCleaners   = ['admin', 'chef'].includes(role)
  const canEditCleaners  = ['admin', 'chef'].includes(role)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const fetches = []
      if (canSeeBeverages) fetches.push(fetch(`${BASE}/beverages/`, { headers: h }).then(r => r.json()).catch(() => []))
      else fetches.push(Promise.resolve([]))
      if (canSeeCleaners) fetches.push(fetch(`${BASE}/cleaners/`, { headers: h }).then(r => r.json()).catch(() => []))
      else fetches.push(Promise.resolve([]))
      const [b, c] = await Promise.all(fetches)
      setBeverages(Array.isArray(b) ? b : [])
      setCleaners(Array.isArray(c) ? c : [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { if (token && activeTab === "dashboard") fetchAll() }, [token, activeTab])

  const createBeverage = async (data) => {
    const res = await fetch(`${BASE}/beverages/`, { method: "POST", headers: h, body: JSON.stringify(data) })
    const json = await res.json(); const item = json.beverage || json
    if (item?.id) setBeverages(prev => [...prev, item])
  }
  const updateBeverage = async (id, data) => {
    const res = await fetch(`${BASE}/beverages/${id}/`, { method: "PUT", headers: h, body: JSON.stringify(data) })
    const json = await res.json(); const item = json.beverage || json
    if (item?.id) setBeverages(prev => prev.map(b => b.id === id ? item : b))
  }
  const deleteBeverage = async (id) => {
    await fetch(`${BASE}/beverages/${id}/`, { method: "DELETE", headers: h })
    setBeverages(prev => prev.filter(b => b.id !== id))
  }
  const createCleaner = async (data) => {
    const res = await fetch(`${BASE}/cleaners/`, { method: "POST", headers: h, body: JSON.stringify(data) })
    const json = await res.json(); const item = json.cleaner || json
    if (item?.id) setCleaners(prev => [...prev, item])
  }
  const updateCleaner = async (id, data) => {
    const res = await fetch(`${BASE}/cleaners/${id}/`, { method: "PUT", headers: h, body: JSON.stringify(data) })
    const json = await res.json(); const item = json.cleaner || json
    if (item?.id) setCleaners(prev => prev.map(c => c.id === id ? item : c))
  }
  const deleteCleaner = async (id) => {
    await fetch(`${BASE}/cleaners/${id}/`, { method: "DELETE", headers: h })
    setCleaners(prev => prev.filter(c => c.id !== id))
  }

  const filterItems = (items) => items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.brand || "").toLowerCase().includes(search.toLowerCase())
  )
  const filteredBev = filterItems(beverages)
  const filteredCln = filterItems(cleaners)
  const showBev = type === "all" || type === "beverages"
  const showCln = type === "all" || type === "cleaners"

  if (activeTab !== "dashboard") return null

  return (
    <div className="min-h-screen text-white ghm-db" style={{ background: '#0d0d0d' }}>
      <style>{STYLES}</style>
      <div className="pt-24 p-6 max-w-7xl mx-auto">
        <br /><br />
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input className="search-input" placeholder="Search by name or brand..." onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="type-toggle">
            {["all","beverages","cleaners"].map(t => (
              <button key={t} className={`type-btn ${type === t ? "active" : ""}`} onClick={() => setType(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "40px" }}>Loading...</p>}

        {showBev && !loading && (
          <div className="mb-10">
            <div className="section-header">
              <span className="section-label">Beverages — {filteredBev.length}</span>
              {canEditBeverages && (
                <button className="add-btn" onClick={() => setModal("beverage")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Beverage
                </button>
              )}
            </div>
            {filteredBev.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBev.map(b => <ItemCard key={b.id} item={b} onSave={updateBeverage} onDelete={deleteBeverage} canEdit={canEditBeverages} />)}
              </div>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", padding: "16px 0" }}>No beverages found.</p>
            )}
          </div>
        )}

        {showCln && !loading && (
          <div className="mb-10">
            <div className="section-header">
              <span className="section-label">Cleaners — {filteredCln.length}</span>
              {canEditCleaners && (
                <button className="add-btn" onClick={() => setModal("cleaner")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Cleaner
                </button>
              )}
            </div>
            {filteredCln.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCln.map(c => <ItemCard key={c.id} item={c} onSave={updateCleaner} onDelete={deleteCleaner} canEdit={canEditCleaners} />)}
              </div>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", padding: "16px 0" }}>No cleaners found.</p>
            )}
          </div>
        )}
      </div>

      {modal && (
        <CreateModal type={modal} onClose={() => setModal(null)} onSave={modal === "beverage" ? createBeverage : createCleaner} />
      )}

      <AIAgent token={token} beverages={beverages} cleaners={cleaners} />
    </div>
  )
}