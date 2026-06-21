"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SetupUsernamePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    setUserId(data.user.id);

    // check if profile already exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .single();

    if (profile?.username) {
      router.push("/");
      return;
    }

    setLoading(false);
  }

  async function createProfile() {
    if (!userId) return;

    if (!username.trim()) {
      setMessage("Username cannot be empty");
      return;
    }

    setMessage("Creating profile...");

    const { error } = await supabase.from("profiles").insert([
      {
        id: userId,
        username: username.trim(),
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Profile created!");

    router.push("/");
  }

  if (loading) {
    return (
      <main style={page}>
        <p>Checking account...</p>
      </main>
    );
  }

  return (
    <main style={page}>
      <h1>Choose your username</h1>

      <p style={{ opacity: 0.7 }}>
        This will be your permanent leaderboard name.
      </p>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={input}
      />

      <button onClick={createProfile} style={button}>
        Save Username
      </button>

      <p>{message}</p>
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
  gap: 10,
  fontFamily: "Arial",
};

const input: React.CSSProperties = {
  padding: 10,
  width: 300,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#111",
  color: "white",
};

const button: React.CSSProperties = {
  padding: 10,
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  width: 200,
};