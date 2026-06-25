"use client";

import { useState } from "react";

type Tab = "normal" | "speedrun" | "onehand";

export default function RulesPage() {
  const [tab, setTab] = useState<Tab>("normal");

  function nextTab() {
    setTab((prev) => {
      if (prev === "normal") return "speedrun";
      if (prev === "speedrun") return "onehand";
      return "normal";
    });
  }

  function prevTab() {
    setTab((prev) => {
      if (prev === "normal") return "onehand";
      if (prev === "speedrun") return "normal";
      return "speedrun";
    });
  }

  return (
    <main style={page}>
      <h1>GTK Rules</h1>

      <p style={{ opacity: 0.7 }}>
        Official rules for all GTK map completions and submissions.
      </p>

      {/* ---------------- NORMAL RULES ---------------- */}
      {tab === "normal" && (
        <section style={block}>
          <h2>Normal Rules</h2>

          <ul style={list}>
            <li>A1 - All GTK must be done in Casual</li>
            <li>A2 - GTK runs cannot be done using mods in any way</li>
            <li>A3 - Normal runs can be done using speedrun skips</li>
            <li>A4 - Having a friend help you on memory sections is not allowed</li>
            <li>A5 - Hoverboards are not allowed</li>
            <li>A6 - Snowballs are not allowed unless listed as allowed</li>
            <li>A7 - No play space abuse or glitch walking (crouch jumping allowed)</li>
            <li>A8 - No tracking glitches or prediction abuse (including DC flicking)</li>
            <li>A9 - No monke blocks mini portal launching</li>
            <li>A10 - No menu phasing through objects</li>
            <li>A11 - No cosmetic advantages</li>
            <li>A12 - Only 90Hz allowed (must be shown via OVR or equivalent)</li>
            <li>A13 - Bonus stages must be completed (e.g. Mount Winter)</li>
            <li>A14 - Trusted Level Lister confirmations allowed via Discord</li>
            <li>A15 - No hand holding advantage (literal or memory)</li>
            <li>A16 - HTC Vive, Pico, Worldscale, and Pimax are banned</li>
            <li>A17 - Lucy usage is banned</li>
            <li>A18 - Stick extension / arm length advantage is banned</li>
          </ul>
        </section>
      )}

      {/* ---------------- SPEEDRUN RULES ---------------- */}
      {tab === "speedrun" && (
        <section style={block}>
          <h2>Speedrun Rules</h2>

          <ul style={list}>
            <li>B1 - All GTK speedruns must be done in Casual</li>
            <li>B2 - GTK speedruns cannot be done using mods in any way</li>
            <li>B3 - Speedruns can decide not to use skips</li>
            <li>B4 - Hoverboards are not allowed</li>
            <li>B5 - Snowballs are not allowed unless allowed by map</li>
            <li>B6 - No playspace abuse or glitch walking (crouch jumping allowed)</li>
            <li>B7 - No tracking glitches or prediction abuse (including DC flicking)</li>
            <li>B8 - Timer starts first frame leaving stump</li>
            <li>B9 - Timer ends at finish trigger / obvious endpoint</li>
            <li>B10 - No Monke Blocks mini portal launch</li>
            <li>B11 - No menu phasing through objects</li>
            <li>B12 - No cosmetic advantages</li>
            <li>B13 - Only 90Hz allowed (must show OVR or equivalent)</li>
            <li>B14 - Bonus stages must be completed</li>
            <li>B15 - No hand holding (literal or memory)</li>
            <li>B16 - HTC Vive, Pico, Pimax banned</li>
            <li>B17 - Lucy usage banned</li>
            <li>B18 - Stick / arm length advantage banned</li>
          </ul>
        </section>
      )}

      {/* ---------------- ONE HAND RULES ---------------- */}
      {tab === "onehand" && (
        <section style={block}>
          <h2>One-Hand Rules</h2>

          <ul style={list}>
            <li>C1 - All GTKO must be done in Casual</li>
            <li>C2 - GTKO cannot use mods</li>
            <li>C3 - Speedrun skips allowed</li>
            <li>C4 - Lucy usage banned</li>
            <li>C5 - Hoverboards not allowed</li>
            <li>C6 - Snowballs not allowed unless possible</li>
            <li>C7 - No playspace abuse or glitch walking (crouch jumping allowed)</li>
            <li>C8 - No tracking glitches or prediction abuse (DC flicking included)</li>
            <li>C9 - Must use ONE controller</li>
            <li>C10 - No Monke Blocks mini portal launch</li>
            <li>C11 - No menu phasing through objects</li>
            <li>C12 - No cosmetic advantages</li>
            <li>C13 - Only 90Hz allowed (OVR required if possible)</li>
            <li>C14 - Bonus stages must be completed</li>
            <li>C15 - No stick / arm extension advantage</li>
            <li>C16 - No hand holding / memory assistance</li>
            <li>C17 - HTC Vive, Pico, Pimax banned</li>
          </ul>
        </section>
      )}

      {/* ---------------- NAV ARROWS ---------------- */}
      <div style={nav}>
        <button onClick={prevTab} style={arrow}>
          ◀
        </button>

        <div style={{ opacity: 0.6 }}>
          {tab === "normal" && "Normal Rules"}
          {tab === "speedrun" && "Speedrun Rules"}
          {tab === "onehand" && "One-Hand Rules"}
        </div>

        <button onClick={nextTab} style={arrow}>
          ▶
        </button>
      </div>
    </main>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  padding: 40,
  color: "white",
  background: "#0f0f0f",
  minHeight: "100vh",
  fontFamily: "Arial",
};

const block: React.CSSProperties = {
  marginTop: 20,
};

const list: React.CSSProperties = {
  marginTop: 10,
  paddingLeft: 20,
  lineHeight: "1.8",
};

const nav: React.CSSProperties = {
  marginTop: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
};

const arrow: React.CSSProperties = {
  padding: "8px 14px",
  background: "#222",
  border: "1px solid #444",
  color: "white",
  borderRadius: 6,
  cursor: "pointer",
};