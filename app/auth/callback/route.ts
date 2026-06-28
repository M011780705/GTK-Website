import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  console.log("========== CALLBACK HIT ==========");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  console.log("Code exists:", !!code);

  if (!code) {
    console.log("No OAuth code found.");
    return NextResponse.redirect(`${url.origin}/login`);
  }

  console.log("Creating Supabase client...");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log("Exchanging OAuth code...");

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("Exchange error:", error);
  console.log("Exchange user:", data?.user);
  console.log("Exchange session:", data?.session);

  if (error || !data?.user) {
    console.log("Stopping because auth failed.");
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const user = data.user;

  console.log("User ID:", user.id);
  console.log("User email:", user.email);
  console.log("User metadata:", user.user_metadata);

  const username =
    user.user_metadata?.global_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    user.user_metadata?.user_name ||
    "Discord User";

  console.log("Username chosen:", username);

  console.log("Attempting profile upsert...");

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

  console.log("Upsert data:", upsertData);
  console.log("Upsert error:", upsertError);

  console.log("========== CALLBACK COMPLETE ==========");

  return NextResponse.redirect(`${url.origin}/`);
}