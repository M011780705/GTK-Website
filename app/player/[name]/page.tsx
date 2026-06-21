import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const playerName = decodeURIComponent(name);

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
    (str ?? "").trim().toLowerCase();

  const mapLookup = new Map(
    safeMaps.map((m) => [normalize(m.name), m.points ?? 0])
  );

  const acceptedRuns = safeSubs.filter(
    (s) =>
      normalize(s.player) === normalize(playerName) &&
      normalize(s.status) === "accepted"
  );

  const completions = acceptedRuns.map((s) => ({
    map: s.map,
    points: mapLookup.get(normalize(s.map)) ?? 0,
  }));

  const totalPoints = completions.reduce(
    (sum, c) => sum + c.points,
    0
  );

  return (
    <main style={page}>
      <h1>{playerName}</h1>

      <p style={{ opacity: 0.6 }}>
        {totalPoints} points • {completions.length} completions
      </p>

      <h2 style={{ marginTop: 20 }}>Completions</h2>

      <section style={list}>
        {completions.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No accepted completions yet
          </p>
        ) : (
          completions.map((c, i) => (
            <div key={i} style={card}>
              {c.map} — {c.points} pts
            </div>
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

const card: React.CSSProperties = {
  padding: 12,
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
};