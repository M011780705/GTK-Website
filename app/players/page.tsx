import { createSupabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function PlayersPage() {
  const supabase = createSupabaseServer();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("player, map, status");

  const { data: maps } = await supabase
    .from("maps")
    .select("name, points");

  const safeSubs = submissions ?? [];
  const safeMaps = maps ?? [];

  const normalize = (str: string) =>
    str.trim().toLowerCase();

  const mapLookup = new Map(
    safeMaps.map((m) => [normalize(m.name), m.points])
  );

  const scores: Record<string, number> = {};

  safeSubs
    .filter((s) => normalize(s.status) === "accepted")
    .forEach((s) => {
      const pts = mapLookup.get(normalize(s.map)) ?? 0;

      scores[s.player] =
        (scores[s.player] || 0) + pts;
    });

  const leaderboard = Object.entries(scores)
    .map(([player, points]) => ({ player, points }))
    .sort((a, b) => b.points - a.points);

  return (
    <main style={page}>
      <h1>Player Leaderboard</h1>

      <p style={{ opacity: 0.6 }}>
        Click a player to view their profile
      </p>

      <section style={list}>
        {leaderboard.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No players yet
          </p>
        ) : (
          leaderboard.map((p, i) => (
            <Link
              key={p.player}
              href={`/player/${encodeURIComponent(p.player)}`}
              style={linkCard}
            >
              <div style={cardContent}>
                <span style={rank}>#{i + 1}</span>

                <span style={name}>
                  {p.player}
                </span>

                <span style={points}>
                  {p.points} pts
                </span>
              </div>
            </Link>
          ))
        )}
      </section>
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
  marginTop: 20,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const linkCard: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
};

const cardContent: React.CSSProperties = {
  padding: 12,
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const rank: React.CSSProperties = {
  opacity: 0.7,
  width: 50,
};

const name: React.CSSProperties = {
  flex: 1,
};

const points: React.CSSProperties = {
  opacity: 0.8,
};