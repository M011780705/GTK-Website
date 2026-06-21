"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitPage() {
  const [map, setMap] = useState("");
  const [runType, setRunType] = useState("normal");
  const [runTime, setRunTime] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setMessage("You must be logged in");
      setLoading(false);
      return;
    }

    setUserId(auth.user.id);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", auth.user.id)
      .single();

    if (error || !profile) {
      setMessage("Profile not found. Contact admin.");
      setLoading(false);
      return;
    }

    setUsername(profile.username);
    setLoading(false);
  }

  async function submitRun() {
    setMessage("Submitting...");

    if (!userId || !username) {
      setMessage("Account not ready.");
      return;
    }

    if (!map.trim()) {
      setMessage("Map name required.");
      return;
    }

    const { error } = await supabase.from("submissions").insert([
      {
        user_id: userId,
        username: username,

        map: map.trim(),
        run_type: runType,
        run_time: runTime ? Number(runTime) : null,
        video_url: videoUrl.trim(),

        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Run submitted!");

    setMap("");
    setRunTime("");
    setVideoUrl("");
    setRunType("normal");
  }

  if (loading) {
    return (
      <main style={page}>
        <p>Loading account...</p>
      </main>
    );
  }

  return (
    <main style={page}>
      <h1>Submit Run</h1>

      <p style={{ opacity: 0.7 }}>
        Logged in as: <b>{username}</b>
      </p>

      <input
        placeholder="Map name"
        value={map}
        onChange={(e) => setMap(e.target.value)}
        style={input}
      />

      <select
        value={runType}
        onChange={(e) => setRunType(e.target.value)}
        style={input}
      >
        <option value="normal">Normal</option>
        <option value="speedrun">Speedrun</option>
        <option value="onehanded">One-Handed</option>
      </select>

      <input
        placeholder="Run time (seconds)"
        value={runTime}
        onChange={(e) => setRunTime(e.target.value)}
        style={input}
      />

      <input
        placeholder="Video proof URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        style={input}
      />

      <button onClick={submitRun} style={button}>
        Submit
      </button>

      <p style={{ marginTop: 10 }}>{message}</p>
    </main>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  padding: 40,
  background: "#0f0f0f",
  color: "white",
  minHeight: "100vh",
  fontFamily: "Arial",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const input: React.CSSProperties = {
  padding: 10,
  width: "100%",
  maxWidth: 500,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#111",
  color: "white",
  boxSizing: "border-box",
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