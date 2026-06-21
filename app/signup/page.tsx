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

    try {
      // 1. Check username exists
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (checkError) {
        console.log("USERNAME CHECK ERROR:", checkError);
        setMessage(checkError.message || "Username check failed");
        return;
      }

      if (existing) {
        setMessage("That username is already taken.");
        return;
      }

      // 2. Create auth account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("SIGNUP RESULT:", { data, error });

      if (error) {
        console.log("SIGNUP ERROR FULL:", error);
        setMessage(error.message || JSON.stringify(error) || "Signup failed");
        return;
      }

      if (!data?.user) {
        setMessage("No user returned. Check email confirmation settings.");
        return;
      }

      // 3. Create profile safely
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        username,
        is_admin: false,
      });

      if (profileError) {
        console.log("PROFILE ERROR:", profileError);
        setMessage(profileError.message || "Profile creation failed");
        return;
      }

      setMessage(
        "Account created! Check your email and confirm before logging in."
      );

      router.push("/login");
    } catch (err: any) {
      console.log("UNEXPECTED ERROR:", err);
      setMessage(err?.message || "Unexpected error occurred");
    }
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