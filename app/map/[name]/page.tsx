import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function MapPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const supabase = createSupabaseServer();

  const mapName = decodeURIComponent(name);

  const { data: maps } = await supabase
    .from("maps")
    .select(
      "id, name, points, category, speedrun_points, speedrun_time_required, onehanded_points"
    );

  const { data: submissions } = await supabase
    .from("submissions")
    .select("player, map, status");

  const safeMaps = maps ?? [];
  const safeSubs = submissions ?? [];

  const normalize = (s: string) =>
    (s ?? "").trim().toLowerCase();

  const map = safeMaps.find(
    (m) => normalize(m.name) === normalize(mapName)
  );

  const mapSubs = safeSubs.filter(
    (s) =>
      normalize(s.map) === normalize(mapName) &&
      normalize(s.status) === "accepted"
  );

  return (
    <main style={page}>
      <h1>{map?.name ?? mapName}</h1>

      <p style={{ opacity: 0.6 }}>
        {map?.points ?? 0} points • {map?.category ?? "unknown"}
      </p>

      <div style={statsBox}>
        <div>
          🏃 Speedrun Points: {map?.speedrun_points ?? 0}
        </div>

        <div>
          ⏱ Speedrun Required Time:{" "}
          {map?.speedrun_time_required ?? "None"}s
        </div>

        <div>
          ✋ One-Handed Points:{" "}
          {map?.onehanded_points ?? 0}
        </div>
      </div>

      <h2 style={{ marginTop: 20 }}>Completions</h2>

      <section style={list}>
        {mapSubs.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No accepted completions yet
          </p>
        ) : (
          mapSubs.map((s, i) => {
            // PLACEHOLDERS FOR NOW (we'll upgrade later)
            const isOneHanded = false;
            const isSpeedrun = false;

            return (
              <div key={i} style={card}>
                <span style={{ marginRight: 10 }}>
                  {s.player}
                </span>

                <span style={flags}>
                  ✋ {isOneHanded ? "✅" : "❌"}{" "}
                  | 🏃 {isSpeedrun ? "✅" : "❌"}
                </span>
              </div>
            );
          })
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

const statsBox: React.CSSProperties = {
  marginTop: 15,
  padding: 12,
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  gap: 6,
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
  display: "flex",
  justifyContent: "space-between",
};

const flags: React.CSSProperties = {
  opacity: 0.8,
};