"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    setMessage("Creating account...");

    // Check if username already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      setMessage("That username is already taken.");
      return;
    }

    // Create auth account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setMessage("Unable to create account.");
      return;
    }

    // Create profile (safe insert)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        username,
        is_admin: false,
      });

    if (profileError) {
      setMessage(profileError.message);
      return;
    }

    setMessage("Account created! Please confirm your email before logging in.");

    router.push("/login");
  }

  return (
    <main style={page}>
      <h1>Create Account</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={input}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={signUp} style={button}>
        Create Account
      </button>

      <p style={{ marginTop: 10 }}>{message}</p>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: 40,
  color: "white",
  background: "#0f0f0f",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  fontFamily: "Arial",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#111",
  color: "white",
  width: "100%",
  maxWidth: 400,
};

const button: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  background: "#333",
  color: "white",
  width: 200,
};