"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  async function loginWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          // 🔥 FORCE PKCE FLOW CLEANLY
          response_type: "code",
        },
      },
    });
  }

  return (
    <main style={page}>
      <h1>Gorilla Tag Kaizo</h1>

      <button onClick={loginWithDiscord} style={button}>
        Continue with Discord
      </button>
    </main>
  );
}

const page: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 20,
  background: "#0f0f0f",
  color: "white",
  fontFamily: "Arial",
};

const button: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 8,
  background: "#5865F2",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
};