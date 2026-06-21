"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Submission = {
  id: number;
  player: string;
  map: string;
  run_type: string;
  run_time: number | null;
  video_url: string;
  status: string;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    // 1. Get user
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user?.email) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setEmail(user.email);

    // 2. Check admin
    const { data: adminData } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email);

    const ok = (adminData?.length ?? 0) > 0;

    if (!ok) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    // 3. Load submissions (IMPORTANT: include id explicitly)
    const { data, error } = await supabase
      .from("submissions")
      .select("id, player, map, run_type, run_time, video_url, status")
      .order("id", { ascending: false });

    console.log("SUBMISSIONS LOADED:", data, error);

    setSubs((data as Submission[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(
    id: number,
    status: "accepted" | "rejected"
  ) {
    console.log("UPDATING:", { id, status });

    const { data, error } = await supabase
      .from("submissions")
      .update({ status })
      .eq("id", id)
      .select();

    console.log("UPDATE RESULT:", { data, error });

    // refresh list
    await load();
  }

  if (loading) {
    return (
      <main style={page}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main style={page}>
        <h1>Not authorized</h1>
        <p>Logged in as: {email}</p>
      </main>
    );
  }

  return (
    <main style={page}>
      <h1>Admin Dashboard</h1>
      <p style={{ opacity: 0.6 }}>Logged in as: {email}</p>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <div style={list}>
        {subs.length === 0 ? (
          <p>No submissions yet</p>
        ) : (
          subs.map((s) => (
            <div key={s.id} style={card}>
              <b>
                {s.player} — {s.map}
              </b>

              <div style={{ fontSize: 13, opacity: 0.7 }}>
                Type: {s.run_type} | Time:{" "}
                {s.run_time ?? "N/A"} | Status: {s.status}
              </div>

              {s.video_url && (
                <a
                  href={s.video_url}
                  target="_blank"
                  style={{ color: "#4ea1ff" }}
                >
                  Watch Video
                </a>
              )}

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  style={acceptBtn}
                  onClick={() => updateStatus(s.id, "accepted")}
                >
                  Accept
                </button>

                <button
                  style={rejectBtn}
                  onClick={() => updateStatus(s.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: 40,
  color: "white",
  background: "#0f0f0f",
  minHeight: "100vh",
  fontFamily: "Arial",
};

const list: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const card: React.CSSProperties = {
  padding: 15,
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
};

const acceptBtn: React.CSSProperties = {
  padding: "6px 10px",
  background: "#1f7a3a",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const rejectBtn: React.CSSProperties = {
  padding: "6px 10px",
  background: "#7a1f1f",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};