import { cookies } from "next/headers";

export default function TestPage() {
  const cookieStore = cookies();

  return (
    <pre style={{ color: "white" }}>
      {JSON.stringify(
        {
          type: typeof cookieStore,
          keys: Object.keys(cookieStore),
          raw: cookieStore,
        },
        null,
        2
      )}
    </pre>
  );
}