"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SetupUsernamePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    setUserId(data.user.id);

    // Try to pull Discord metadata
    const discordName =
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.name ||
      "Player";

    setUsername(discordName);
    setLoading(false);
  }

  async function save() {
    if (!userId) return;

    await supabase.from("profiles").upsert({
      id: userId,
      username: username.trim(),
    });

    router.push("/");
  }

  if (loading) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }

  return (
    <main style={page}>
      <h1>Choose Username</h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={input}
      />

      <button onClick={save} style={button}>
        Continue
      </button>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: 40,
  background: "#0f0f0f",
  color: "white",
  minHeight: "100vh",
  fontFamily: "Arial",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#111",
  color: "white",
};

const button: React.CSSProperties = {
  marginTop: 10,
  padding: 10,
  background: "#5865F2",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};