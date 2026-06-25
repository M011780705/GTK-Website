"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    // 1. Get user
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setEmail(user.email ?? null);

    // 2. CHECK SUPABASE ADMIN FLAG (NEW SYSTEM)
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !profile?.is_admin) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    // 3. LOAD SUBMISSIONS
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .order("id", { ascending: false });

    setSubs(submissions ?? []);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await supabase.from("submissions").update({ status }).eq("id", id);
    await load();
  }

  if (loading) {
    return (
      <main style={{ padding: 40, color: "white" }}>
        Loading...
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: 40, color: "white" }}>
        <h1>Not authorized</h1>
        <p>You do not have admin permissions.</p>
        <p style={{ opacity: 0.6 }}>Logged in as: {email}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, color: "white", background: "#0f0f0f" }}>
      <h1>Admin Dashboard</h1>

      <p style={{ opacity: 0.6 }}>Logged in as: {email}</p>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      {subs.length === 0 ? (
        <p>No submissions yet</p>
      ) : (
        subs.map((s) => (
          <div
            key={s.id}
            style={{ padding: 10, border: "1px solid #333", marginBottom: 10 }}
          >
            <b>
              {s.player} — {s.map}
            </b>

            <p>Status: {s.status}</p>

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
                onClick={() => updateStatus(s.id, "accepted")}
                style={{
                  background: "#1f7a3a",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(s.id, "rejected")}
                style={{
                  background: "#7a1f1f",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}