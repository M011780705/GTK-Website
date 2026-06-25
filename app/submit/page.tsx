"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Map = {
  id: number;
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
    try {
      // Get logged-in user
      const { data: auth, error: authError } = await supabase.auth.getUser();

      console.log("Auth:", auth);
      console.log("Auth error:", authError);

      if (!auth.user) {
        setMessage("You must be logged in.");
        setLoading(false);
        return;
      }

      setUserId(auth.user.id);

      // Load profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", auth.user.id)
        .single();

      console.log("Profile:", profile);
      console.log("Profile error:", profileError);

      if (profileError || !profile) {
        setMessage("Profile not found.");
        setLoading(false);
        return;
      }

      setUsername(profile.username);

      // Load maps
      const { data: mapData, error: mapError } = await supabase
        .from("maps")
        .select("*")
        .order("name");

      console.log("========== MAP DEBUG ==========");
      console.log("Map data:", mapData);
      console.log("Map error:", mapError);
      console.log("Rows returned:", mapData?.length);
      console.log("===============================");

      if (mapError) {
        setMessage("Failed to load maps: " + mapError.message);
        setLoading(false);
        return;
      }

      setMaps(mapData ?? []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error.");
      setLoading(false);
    }
  }

  async function submitRun() {
    setMessage("Submitting...");

    if (!userId || !username) {
      setMessage("Account not ready.");
      return;
    }

    if (!map) {
      setMessage("Please select a map.");
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
      console.error(error);
      setMessage(error.message);
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
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main style={page}>
      <h1>Submit Run</h1>

      <p>
        Logged in as: <b>{username}</b>
      </p>

      <p>
        Maps loaded: <b>{maps.length}</b>
      </p>

      <select
        value={map}
        onChange={(e) => setMap(e.target.value)}
        style={input}
      >
        <option value="">Select a map...</option>

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
  maxWidth: 500,
  width: "100%",
  borderRadius: 6,
  border: "1px solid #333",
  background: "#111",
  color: "white",
  boxSizing: "border-box",
};

const button: React.CSSProperties = {
  padding: 10,
  width: 200,
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};