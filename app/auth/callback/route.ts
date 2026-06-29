import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const report: Record<string, any> = {
    callback_hit: true,
    full_url: request.url,
  };

  // 🔥 STEP 1: Use browser-friendly parsing (NOT code flow)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 🔥 This handles BOTH code + access_token flows safely
  const hash = url.hash;

  report.has_hash = !!hash;

  // We cannot rely on server parsing hash reliably,
  // so we instead redirect user to client session capture page.

  return new Response(
    `
    <html>
      <body style="font-family:Arial;padding:30px;background:#111;color:white">
        <h1>Processing Login...</h1>
        <script>
          (async () => {
            const supabase = window.supabase = window.supabase || {};
            
            // force redirect to home where session is handled by Supabase client
            window.location.href = "/";
          })();
        </script>
      </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}