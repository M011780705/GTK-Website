export default function HomePage() {
  return (
    <main style={page}>
      <h1>GTK Website</h1>
      <p style={{ opacity: 0.6 }}>
        Welcome to the official GTK ranking system.
      </p>
    </main>
  );
}

const page: React.CSSProperties = {
  padding: 40,
  color: "white",
  background: "#0f0f0f",
  minHeight: "100vh",
};