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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 🔥 FULL DEBUG OUTPUT
      console.log("LOGIN RESPONSE DATA:", data);
      console.log("LOGIN RESPONSE ERROR:", error);

      // 🚨 HARD ERROR CHECK
      if (error) {
        setMessage(
          error.message ||
            JSON.stringify(error, null, 2) ||
            "Login failed (unknown error)"
        );
        return;
      }

      // 🚨 SESSION CHECK (VERY IMPORTANT)
      if (!data?.session) {
        setMessage("No active session. Check email confirmation.");
        return;
      }

      setMessage("Login successful!");
      router.push("/");
    } catch (err: any) {
      console.log("UNEXPECTED LOGIN ERROR:", err);

      setMessage(
        err?.message ||
          JSON.stringify(err, null, 2) ||
          "Unexpected login error"
      );
    }
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
  boxSizing: "border-box",
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