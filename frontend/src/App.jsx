'use client'
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Parties from "./components/Parties";
import Login from "./Login";

export default function App() {
  const [token, setToken]       = useState(() => localStorage.getItem("ghm_token"));
  const [username, setUsername] = useState(() => localStorage.getItem("ghm_username") || "");
  const [role, setRole]         = useState(() => localStorage.getItem("ghm_role") || "");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLoginSuccess = (tok, user, rol) => {
    localStorage.setItem("ghm_token", tok);
    localStorage.setItem("ghm_username", user);
    localStorage.setItem("ghm_role", rol);
    setToken(tok);
    setUsername(user);
    setRole(rol);
  };

  const handleLogout = () => {
    localStorage.removeItem("ghm_token");
    localStorage.removeItem("ghm_username");
    localStorage.removeItem("ghm_role");
    setToken(null);
    setUsername("");
    setRole("");
  };

  if (!token) return <Login onLoginSuccess={handleLoginSuccess} />;

  // Tabs visibles según rol
  const canSeeDashboard = true; // todos ven el dashboard (aunque chef no ve beverages)
  const canSeeAnalytics = ['admin', 'beverage_manager', 'bartender', 'chef'].includes(role);
  const canSeeParties   = ['admin', 'beverage_manager', 'bartender'].includes(role);

  return (
    <div>
      <Navbar
        username={username}
        role={role}
        onLogout={handleLogout}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      {activeTab === "dashboard" && <Dashboard token={token} role={role} activeTab={activeTab} />}
      {activeTab === "analytics" && canSeeAnalytics && <Analytics token={token} role={role} />}
      {activeTab === "parties"   && canSeeParties   && <Parties   token={token} role={role} activeTab={activeTab} />}
    </div>
  );
}