"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Map = {
  id: string;
  name: string;
};

export default function SubmitPage() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [map, setMap] = useState("");
  const [runType, setRunType] = useState("normal");
  const [runTime, setRunTime] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    // 1. Get user
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setMessage("You must be logged in");
      setLoading(false);
      return;
    }

    setUserId(auth.user.id);

    // 2. Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", auth.user.id)
      .single();

    if (!profile) {
      setMessage("Profile not found");
      setLoading(false);
      return;
    }

    setUsername(profile.username);

    // 3. LOAD MAPS FROM DATABASE (THIS IS THE KEY FIX)
    const { data: mapData, error } = await supabase
      .from("maps")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.log("MAP LOAD ERROR:", error);
      setMessage("Failed to load maps");
      setLoading(false);
      return;
    }

    setMaps(mapData ?? []);
    setLoading(false);
  }

  async function submitRun() {
    setMessage("Submitting...");

    if (!userId || !username) return;

    if (!map) {
      setMessage("Please select a map");
      return;
    }

    const { error } = await supabase.from("submissions").insert([
      {
        user_id: userId,
        username,
        map,
        run_type: runType,
        run_time: runTime ? Number(runTime) : null,
        video_url: videoUrl.trim(),
        status: "pending",
      },
    ]);

    if (error) {
      console.log(error);
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
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={page}>
      <h1>Submit Run</h1>

      <p style={{ opacity: 0.7 }}>
        Logged in as: <b>{username}</b>
      </p>

      {/* MAP DROPDOWN FROM DATABASE */}
      <select
        value={map}
        onChange={(e) => setMap(e.target.value)}
        style={input}
      >
        <option value="">Select a map</option>

        {maps.map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>

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

      <p>{message}</p>
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