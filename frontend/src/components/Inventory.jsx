import React from "react";
import BeverageList from "./BeverageList";
import CleanerList from "./CleanerList";

export default function Inventory() {
  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      background: "var(--accent)",
      transition: "background .3s"
    }}>
      <h1 style={{ textAlign: "center", color: "#fff" }}>Inventory Dashboard</h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.15)", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}>
          <BeverageList />
        </div>
        <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.15)", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}>
          <CleanerList />
        </div>
      </div>
    </div>
  );
}