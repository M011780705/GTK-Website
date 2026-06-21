"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Submission = {
  id: number;
  map: string;
  status: string;
  run_time: string | null;
  video_url: string | null;
  run_type: string;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const [username, setUsername] = useState("");

  const [subs, setSubs] = useState<Submission[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email ?? "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    setUsername(profile?.username ?? "Unknown");

    const { data } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user.id);

    setSubs(data ?? []);
    setLoading(false);
  }

  const approved = useMemo(
    () => subs.filter((s) => s.status === "accepted"),
    [subs]
  );

  const pending = useMemo(
    () => subs.filter((s) => s.status === "pending"),
    [subs]
  );

  const rejected = useMemo(
    () => subs.filter((s) => s.status === "rejected"),
    [subs]
  );

  const grouped = useMemo(() => {
    return {
      Main: approved.filter((r) => r.run_type === "normal"),
      Speedrun: approved.filter((r) => r.run_type === "speedrun"),
      OneHanded: approved.filter((r) => r.run_type === "onehanded"),
    };
  }, [approved]);

  if (loading) {
    return (
      <main style={page}>
        <h1>Loading profile...</h1>
      </main>
    );
  }

  return (
    <main style={page}>
      {/* HEADER */}
      <div style={headerCard}>
        <div>
          <h1 style={{ margin: 0 }}>{username}</h1>
          <p style={{ opacity: 0.6, marginTop: 5 }}>
            GTK Competitive Profile
          </p>
        </div>

        <div style={emailBox}>
          <p style={{ margin: 0 }}>
            {showEmail ? email : "••••••••••••••"}
          </p>

          <button style={smallBtn} onClick={() => setShowEmail(!showEmail)}>
            {showEmail ? "Hide Email" : "Show Email"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        <Stat label="Total Runs" value={subs.length} />
        <Stat label="Approved" value={approved.length} />
        <Stat label="Pending" value={pending.length} />
        <Stat label="Rejected" value={rejected.length} />
      </div>

      {/* PLACEHOLDERS */}
      <div style={statsGrid}>
        <Stat label="Total Points" value="Coming Soon" />
        <Stat label="Leaderboard Rank" value="Coming Soon" />
      </div>

      {/* SECTIONS */}
      <Section title="Main List Runs" runs={grouped.Main} />
      <Section title="Speedruns" runs={grouped.Speedrun} />
      <Section title="One Handed Runs" runs={grouped.OneHanded} />

      {/* PENDING */}
      <Section title="Pending Submissions" runs={pending} />
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ label, value }: any) {
  return (
    <div style={statCard}>
      <h3 style={{ margin: 0 }}>{value}</h3>
      <p style={{ margin: 0, opacity: 0.6 }}>{label}</p>
    </div>
  );
}

function Section({ title, runs }: any) {
  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ marginBottom: 10 }}>{title}</h2>

      {runs.length === 0 ? (
        <p style={{ opacity: 0.5 }}>No runs yet.</p>
      ) : (
        runs.map((r: Submission) => <RunCard key={r.id} run={r} />)
      )}
    </div>
  );
}

function RunCard({ run }: { run: Submission }) {
  const color =
    run.status === "accepted"
      ? "#2ecc71"
      : run.status === "pending"
      ? "#f1c40f"
      : "#e74c3c";

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>{run.map}</h3>
        <span style={{ color }}>{run.status}</span>
      </div>

      <p style={{ opacity: 0.7, marginTop: 5 }}>
        Type: {run.run_type} {run.run_time ? `| Time: ${run.run_time}` : ""}
      </p>

      {run.video_url && (
        <a href={run.video_url} target="_blank" style={videoBtn}>
          Watch Video
        </a>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  maxWidth: 1000,
  margin: "40px auto",
  color: "white",
  padding: 20,
  fontFamily: "Arial",
};

const headerCard: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 12,
};

const emailBox: React.CSSProperties = {
  textAlign: "right",
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 20,
};

const statCard: React.CSSProperties = {
  padding: 15,
  background: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
};

const card: React.CSSProperties = {
  padding: 15,
  marginTop: 10,
  background: "#181818",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
};

const videoBtn: React.CSSProperties = {
  display: "inline-block",
  marginTop: 10,
  padding: "6px 10px",
  background: "#2b6fff",
  color: "white",
  borderRadius: 6,
  textDecoration: "none",
};

const smallBtn: React.CSSProperties = {
  marginTop: 6,
  padding: "5px 10px",
  fontSize: 12,
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};