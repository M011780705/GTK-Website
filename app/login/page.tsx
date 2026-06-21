"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESULT:", { data, error });

    if (error) {
      if (error.message.toLowerCase().includes("not confirmed")) {
        setMessage("Please confirm your email before logging in.");
        return;
      }

      setMessage(error.message || "Login failed");
      return;
    }

    if (!data.session) {
      setMessage("No active session. Please try again.");
      return;
    }

    router.push("/");
  }

  return (
    <main style={page}>
      <h1>Login</h1>

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

      <button onClick={login} style={button}>
        Login
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