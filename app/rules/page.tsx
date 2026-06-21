export default function RulesPage() {
  return (
    <main style={page}>
      <h1>GTK Rules</h1>

      <p style={{ opacity: 0.7 }}>
        Official rules for all GTK map completions and submissions.
      </p>

      <section style={block}>
        <h2>Rules</h2>

        <ul style={list}>
          <li>A1 - All GTK must be done in Casual</li>
          <li>A2 - GTK runs cannot be done using mods in any way</li>
          <li>A3 - Normal runs can be done using speedrun skips</li>
          <li>A4 - Having a friend help you on memory sections is not allowed</li>
          <li>A5 - Hoverboards are not allowed</li>
          <li>A6 - Snowballs are not allowed unless listed as allowed</li>
          <li>A7 - No play space abuse or glitch walking (crouch jumping allowed)</li>
          <li>A8 - No tracking glitches or prediction abuse (including DC flicking)</li>
          <li>A9 - No monke blocks mini portal launching</li>
          <li>A10 - No menu phasing through objects</li>
          <li>A11 - No cosmetic advantages</li>
          <li>A12 - Only 90Hz allowed (must be shown via OVR or equivalent)</li>
          <li>A13 - Bonus stages must be completed (e.g. Mount Winter)</li>
          <li>A14 - Trusted Level Lister confirmations allowed via Discord</li>
          <li>A15 - No hand holding advantage (literal or memory)</li>
          <li>A16 - HTC Vive, Pico, Worldscale, and Pimax are banned</li>
          <li>A17 - Lucy tool usage is banned</li>
          <li>A18 - Stick extension / arm length advantage is banned</li>
        </ul>
      </section>

      <section style={block}>
        <h2>Important Notes</h2>
        <p>
          These rules apply to all GTK submissions. Breaking rules may result in rejection or removal from rankings.
        </p>
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

const block: React.CSSProperties = {
  marginTop: 20,
};

const list: React.CSSProperties = {
  marginTop: 10,
  paddingLeft: 20,
  lineHeight: "1.8",
};