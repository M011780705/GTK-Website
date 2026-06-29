import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  let report: Record<string, any> = {
    callback_hit: true,
    code_exists: !!code,
  };

  if (!code) {
    return new Response(
      `
      <html>
        <body style="font-family:Arial;padding:30px;background:#111;color:white">
          <h1>OAuth Debug</h1>
          <pre>${JSON.stringify(report, null, 2)}</pre>
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  report.exchange_error = error;
  report.user_exists = !!data?.user;
  report.session_exists = !!data?.session;

  if (!data?.user) {
    return new Response(
      `
      <html>
        <body style="font-family:Arial;padding:30px;background:#111;color:white">
          <h1>OAuth Debug</h1>
          <pre>${JSON.stringify(report, null, 2)}</pre>
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

  const user = data.user;

  report.user = {
    id: user.id,
    email: user.email,
    metadata: user.user_metadata,
  };

  const username =
    user.user_metadata?.global_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.user_name ||
    "Discord User";

  report.username_chosen = username;

  const { data: upsertData, error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
        is_admin: false,
      },
      {
        onConflict: "id",
      }
    )
    .select();

  report.upsert_data = upsertData;
  report.upsert_error = upsertError;

  const { data: profileRow, error: profileLookupError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  report.profile_lookup = profileRow;
  report.profile_lookup_error = profileLookupError;

  return new Response(
    `
    <html>
      <body style="font-family:Arial;padding:30px;background:#111;color:white">
        <h1>OAuth Debug Report</h1>
        <pre>${JSON.stringify(report, null, 2)}</pre>
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