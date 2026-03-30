import React, { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000";

const saveSession = (token, username, role) => {
  localStorage.setItem("ghm_token", token);
  localStorage.setItem("ghm_username", username);
  localStorage.setItem("ghm_role", role);
};

export const getToken    = () => localStorage.getItem("ghm_token");
export const getUsername = () => localStorage.getItem("ghm_username");
export const getRole     = () => localStorage.getItem("ghm_role");
export const logout      = () => {
  localStorage.removeItem("ghm_token");
  localStorage.removeItem("ghm_username");
  localStorage.removeItem("ghm_role");
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState({ username: getUsername(), role: getRole() });

  const login = (token, username, role) => {
    saveSession(token, username, role);
    setUser({ username, role });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setUser({ username: null, role: null });
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, login, logout: handleLogout };
}

export default function Login({ onLoginSuccess }) {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [shake, setShake]             = useState(false);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 1. Obtener token
      const tokenRes = await fetch(`${BASE_URL}/api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!tokenRes.ok) {
        setError("Invalid username or password.");
        triggerShake();
        setLoading(false);
        return;
      }
      const { token } = await tokenRes.json();

      // 2. Obtener rol real desde /api/me/
      const meRes = await fetch(`${BASE_URL}/api/me/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const meData = await meRes.json();
      const role = meData.role || "bartender";

      onLoginSuccess(token, username, role);
    } catch (err) {
      setError("Connection error. Is the server running?");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .ghm-login-root { min-height: 100vh; background: #0a0a0a; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
        .ghm-bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; }
        .ghm-bg-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 4s ease-in-out infinite alternate; }
        .ghm-bg-accent { position: absolute; width: 300px; height: 2px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent); top: 30%; left: 50%; transform: translateX(-50%); pointer-events: none; }
        @keyframes pulse-glow { from { opacity: 0.5; transform: translate(-50%, -50%) scale(1); } to { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } }
        .ghm-card { position: relative; z-index: 10; width: 420px; padding: 48px 44px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; backdrop-filter: blur(20px); opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ghm-card.mounted { opacity: 1; transform: translateY(0); }
        .ghm-card.shake { animation: shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
        .ghm-card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent); }
        .ghm-logo-area { text-align: center; margin-bottom: 40px; }
        .ghm-logo-monogram { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border: 1px solid rgba(99,102,241,0.4); border-radius: 2px; margin-bottom: 20px; position: relative; }
        .ghm-logo-monogram::before { content: ''; position: absolute; inset: 3px; border: 1px solid rgba(99,102,241,0.15); border-radius: 1px; }
        .ghm-logo-letter { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: #a5b4fc; letter-spacing: 2px; line-height: 1; }
        .ghm-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #f8f8f8; letter-spacing: 0.08em; margin-bottom: 6px; }
        .ghm-subtitle { font-size: 11px; font-weight: 300; color: rgba(255,255,255,0.35); letter-spacing: 0.2em; text-transform: uppercase; }
        .ghm-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
        .ghm-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .ghm-divider-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(99,102,241,0.5); }
        .ghm-field { margin-bottom: 20px; position: relative; }
        .ghm-label { display: block; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
        .ghm-input-wrapper { position: relative; }
        .ghm-input { width: 100%; padding: 12px 40px 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300; outline: none; transition: border-color 0.25s, background 0.25s; }
        .ghm-input:focus { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.04); }
        .ghm-input::placeholder { color: rgba(255,255,255,0.18); font-weight: 300; }
        .ghm-eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3); display: flex; align-items: center; transition: color 0.2s; padding: 4px; }
        .ghm-eye-btn:hover { color: rgba(255,255,255,0.7); }
        .ghm-error { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 2px; margin-bottom: 20px; font-size: 12px; color: #fca5a5; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .ghm-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #4f46e5, #6366f1); border: none; border-radius: 2px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; margin-top: 8px; }
        .ghm-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
        .ghm-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .ghm-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ghm-footer { margin-top: 32px; text-align: center; font-size: 10px; color: rgba(255,255,255,0.18); letter-spacing: 0.1em; text-transform: uppercase; }
        .ghm-footer span { color: rgba(99,102,241,0.5); }
        .ghm-role-hint { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .ghm-role-pill { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; border-radius: 1px; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.25); }
      `}</style>

      <div className="ghm-login-root">
        <div className="ghm-bg-grid" />
        <div className="ghm-bg-glow" />
        <div className="ghm-bg-accent" />

        <div className={`ghm-card ${mounted ? "mounted" : ""} ${shake ? "shake" : ""}`}>
          <div className="ghm-logo-area">
            <div className="ghm-logo-monogram">
              <span className="ghm-logo-letter">G</span>
            </div>
            <h1 className="ghm-title">GHM Inventory</h1>
            <p className="ghm-subtitle">Secure Access Portal</p>
          </div>

          <div className="ghm-divider">
            <div className="ghm-divider-line" />
            <div className="ghm-divider-dot" />
            <div className="ghm-divider-line" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="ghm-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="ghm-field">
              <label className="ghm-label">Username</label>
              <div className="ghm-input-wrapper">
                <input type="text" className="ghm-input" placeholder="Enter your username" value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }} autoComplete="username" disabled={loading} />
              </div>
            </div>

            <div className="ghm-field">
              <label className="ghm-label">Password</label>
              <div className="ghm-input-wrapper">
                <input type={showPassword ? "text" : "password"} className="ghm-input" placeholder="Enter your password"
                  value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password" disabled={loading} />
                <button type="button" className="ghm-eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="ghm-btn" disabled={loading}>
              {loading ? <><span className="ghm-spinner" />Authenticating...</> : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "24px" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
              Available roles
            </p>
            <div className="ghm-role-hint">
              {["Admin", "Beverage Manager", "Bartender", "Chef"].map(r => (
                <span key={r} className="ghm-role-pill">{r}</span>
              ))}
            </div>
          </div>

          <div className="ghm-footer">
            <span>GHM</span> · Inventory Management System · <span>v1.0</span>
          </div>
        </div>
      </div>
    </>
  );
}