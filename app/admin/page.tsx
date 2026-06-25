"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_ROLE_ID = "1343948505395499039";
const GUILD_ID = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID!;

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

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setEmail(user.email ?? null);

    // ⚠️ GET DISCORD SESSION
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.provider_token;

    if (!accessToken) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // GET DISCORD MEMBER INFO
    const res = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const member = await res.json();

    const roles = member?.roles ?? [];

    const ok = roles.includes(ADMIN_ROLE_ID);

    if (!ok) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    // LOAD SUBMISSIONS
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

  if (loading) return <main style={{ padding: 40 }}>Loading...</main>;

  if (!isAdmin)
    return (
      <main style={{ padding: 40 }}>
        <h1>Not authorized</h1>
        <p>You do not have the required Discord role.</p>
      </main>
    );

  return (
    <main style={{ padding: 40, color: "white", background: "#0f0f0f" }}>
      <h1>Admin Dashboard</h1>

      <p style={{ opacity: 0.6 }}>Logged in as: {email}</p>

      <hr style={{ margin: "20px 0" }} />

      {subs.map((s) => (
        <div
          key={s.id}
          style={{ padding: 10, border: "1px solid #333", marginBottom: 10 }}
        >
          <b>
            {s.player} — {s.map}
          </b>

          <p>Status: {s.status}</p>

          <button onClick={() => updateStatus(s.id, "accepted")}>
            Accept
          </button>

          <button onClick={() => updateStatus(s.id, "rejected")}>
            Reject
          </button>
        </div>
      ))}
    </main>
  );
}