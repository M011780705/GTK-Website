import { createSupabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function MainListPage() {
  const supabase = createSupabaseServer();

  const { data: maps, error } = await supabase
    .from("maps")
    .select("*")
    .eq("category", "main");

  if (error) {
    return (
      <main style={page}>
        <h1>Main List</h1>
        <p style={{ color: "red" }}>Error: {error.message}</p>
      </main>
    );
  }

  const sorted = [...(maps ?? [])].sort(
    (a, b) => (b.points ?? 0) - (a.points ?? 0)
  );

  return (
    <main style={page}>
      <h1>Main List</h1>

      <p style={{ opacity: 0.6 }}>
        Official ranked GTK maps
      </p>

      <section style={list}>
        {sorted.map((map, i) => {
          const rank = i + 1;

          return (
            <Link
              key={map.id}
              href={`/map/${encodeURIComponent(map.name)}`}
              style={card}
            >
              #{rank} — {map.name} — {map.points} pts
            </Link>
          );
        })}
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
  color: "white",
  textDecoration: "none",
};