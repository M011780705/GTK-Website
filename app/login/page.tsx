"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  async function loginWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main style={page}>
      <h1>Login</h1>

      <button onClick={loginWithDiscord} style={button}>
        Continue with Discord
      </button>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: 40,
  background: "#0f0f0f",
  color: "white",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  fontFamily: "Arial",
};

const button: React.CSSProperties = {
  padding: 12,
  background: "#5865F2",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  width: 220,
};